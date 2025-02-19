import { inject, Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, defer, Observable, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<User| null>(null);
  private tokenExpirationTimer: any;
  userData: User | null = null;
  public _auth = inject(Auth);
  public fireStore = inject(Firestore);
  public ngZone = inject(NgZone);

  constructor(private http: HttpClient,private router: Router) {}
  Login(email: string, password: string): Observable<any> {
    const res = () => signInWithEmailAndPassword(this._auth, email, password);
    // build up a cold observable
    return defer(res);
  }
  Signup(email: string, password: string, custom?: any): Observable<any> {
    const res = () => createUserWithEmailAndPassword(this._auth, email, password);
    // it also accepts an extra attributes, we will handle later
    return defer(res)
  }
  LoginGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    const res = () => signInWithPopup(this._auth, provider);
    return defer(res);
  }

  autoLogin() {
    const data = localStorage.getItem('userData');
    const userData: User = JSON.parse(data || '');
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.uid,
      userData.email,
      '',
      userData._token,
      '',
      new Date(userData._tokenExpirationDate).getTime(),
      userData.emailVerified
    );

    if (loadedUser.token) {
      this.user$.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  async logout() {
    await this._auth.signOut();

    localStorage.removeItem('user');
      localStorage.removeItem('userData');
      this.user$.next(null);
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
      this.router.navigateByUrl('/login');

  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      debugger;
      this.logout();
    }, expirationDuration);
  }

  handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number,
    photoUrl: string,
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000).getTime();
    const user = new User(email, userId, token, photoUrl, '', expirationDate, true);
    this.user$.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }


  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }


  getOpenAIAuthToken(): string{
    return environment.OPENAI_API_KEY;
  }
    // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    return  this._auth.currentUser !== null;
  }

    // Reset Forggot password
    ForgotPassword(passwordResetEmail: string) {
      return sendPasswordResetEmail(this._auth, passwordResetEmail)
        .then(() => {
          window.alert('Password reset email sent, check your inbox.');
        })
        .catch((error: any) => {
          window.alert(error);
        });
    }
}


