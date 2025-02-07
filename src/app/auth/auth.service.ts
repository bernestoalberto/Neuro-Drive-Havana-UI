import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// import {
  // doc,
  //  Firestore,
  // setDoc
// //  } from '@angular/fire/firestore';
import {
  Auth,
  authState,
  // GoogleAuthProvider,
  // createUserWithEmailAndPassword,
  // signInWithEmailAndPassword,
  idToken,
  // signInWithPopup,
  user,
  UserCredential
} from '@angular/fire/auth';
import { AuthResponseData } from './auth.const';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User| null>(null);
  private tokenExpirationTimer: any;

  // private _firestore = inject(Firestore);
  private _auth = inject(Auth);
  authState$ = authState(this._auth);
  user$ = user(this._auth);
  idToken$ = idToken(this._auth);


  constructor(private http: HttpClient,private router: Router) {}


  // byGoogle() {
  //   // you can simply change the Google for another provider here
  //   return signInWithPopup(this._auth, new GoogleAuthProvider()).then(
  //     (auth) => this._setUserData(auth)
  //   );
  // }

  signup(email: string, password: string): Observable<AuthResponseData> {
    const url = `identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`;
    return this.http.post<AuthResponseData>(url, {email, password, returnSecureToken: true}).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        );
      })
    );
  }
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${environment.FIRE_BASE_URL}${environment.firebaseConfig.apiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const data = localStorage.getItem('userData');
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(data || '');
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
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
  // signUpFireBaseApi(email: string, password: string){
  //       return createUserWithEmailAndPassword(
  //     this._auth,
  //     email.trim(),
  //     password.trim()
  //   ).then((auth) => this._setUserData(auth));
  // }
  // loginFireBaseApi(email: string, password: string): Promise<User> {
  //   return signInWithEmailAndPassword(
  //       this._auth,
  //       email.trim(),
  //       password.trim()
  //     ).then((auth: UserCredential) => this._setUserData(auth));
  //   }

  // private _setUserData(auth: UserCredential): Promise<User> {
  //   const user: IUser = {
  //     id: auth.user.uid,
  //     name: (auth.user.displayName || auth.user.email)!,
  //     email: auth.user.email!,
  //     emailVerified: auth.user.emailVerified,
  //     platformId: auth.user.providerId,
  //     lang: 'en',
  //     avatar: auth.user.photoURL || 'https://via.placeholder.com/150',
  //   }
  //     // custom ones
  //   //   lastRoute: string,
  //   //   configId: string,
  //   // };
  //   const userDocRef = doc(this._firestore, `users/${user.id}`);
  //   return setDoc(userDocRef, user).then(() => user);
  // }
}


