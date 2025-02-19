import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) :
| boolean
| UrlTree
| Promise<boolean | UrlTree>
| Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const auth = inject(Auth);
  const localUser = localStorage.getItem('userData');

  if(auth.currentUser || localUser){
    return true;
  }
  return router.createUrlTree(['/login']);
}
