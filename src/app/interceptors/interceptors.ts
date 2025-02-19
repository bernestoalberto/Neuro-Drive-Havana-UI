import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { CACHING_ENABLED } from "../app.config";
import { AuthService } from "../auth/auth.service";
import { AppService } from "../app.service";

export function logginInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const appService = inject(AppService);
  return next(req).pipe(tap(event => {
      if (event.type === HttpEventType.Response) {
         if(event.status === 500) {
          appService.openSnackBar(event.statusText, 'error', 5000);
      }
    }
    return next(req);
    }))

}
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getOpenAIAuthToken();
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`),
  });
  return next(newReq);
}
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return next(req);
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
