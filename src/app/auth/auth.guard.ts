// import { CanActivateFn, UrlTree, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { inject } from '@angular/core';
// import { Auth } from '@angular/fire/auth';

// export const authGuard: CanActivateFn = (route, state) :
// | boolean
// | UrlTree
// | Promise<boolean | UrlTree>
// | Observable<boolean | UrlTree> => {
//   const router = inject(Router);
//   const auth = inject(Auth);
//   const localUser = localStorage.getItem('userData');

//   if(auth.currentUser || localUser){
//     return true;
//   }
//   return router.createUrlTree(['/login']);
// }
import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { User } from 'firebase/auth';
import { Observable, UnaryFunction, of, pipe } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export type AuthPipeGenerator = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => AuthPipe;
export type AuthPipe = UnaryFunction<
  Observable<User | null>,
  Observable<boolean | string | any[]>
>;

export const loggedIn: AuthPipe = map((user) => !!user);

@Injectable({
  providedIn: 'any',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  canActivate = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authPipeFactory =
      (next.data['authGuardPipe'] as AuthPipeGenerator) || (() => loggedIn);
    return user(this.auth).pipe(
      take(1),
      authPipeFactory(next, state),
      map((can) => {
        if (typeof can === 'boolean') {
          if (!can) {
            return this.router.createUrlTree(['/login']);
          }
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else {
          return this.router.parseUrl(can);
        }
      })
    );
  };
}

export const canActivate = (pipe: AuthPipeGenerator) => ({
  canActivate: [AuthGuard],
  data: { authGuardPipe: pipe },
});

export const isNotAnonymous: AuthPipe = map(
  (user) => !!user && !user.isAnonymous
);
export const idTokenResult = switchMap((user: User | null) =>
  user ? user.getIdTokenResult() : of(null)
);
export const emailVerified: AuthPipe = map(
  (user) => !!user && user.emailVerified
);
export const customClaims = pipe(
  idTokenResult,
  map((idTokenResult) => (idTokenResult ? idTokenResult.claims : []))
);
export const hasCustomClaim: (claim: string) => AuthPipe =
  // eslint-disable-next-line no-prototype-builtins
  (claim) =>
    pipe(
      customClaims,
      map((claims) => claims.hasOwnProperty(claim))
    );
export const redirectUnauthorizedTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    loggedIn,
    map((loggedIn) => loggedIn || redirect)
  );
export const redirectLoggedInTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    loggedIn,
    map((loggedIn) => (loggedIn && redirect) || true)
  );
