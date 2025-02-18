import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import {
  Auth,
  authState,
  GoogleAuthProvider,
  idToken,
  AngularFireAuth,
  user,
} from '@angular/fire/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
  } from '@angular/fire/compat/firestore';
import { AuthResponseData } from './auth.const';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User| null>(null);
  private tokenExpirationTimer: any;
  userData: IUser;
  private _firestore = inject(Firestore);
  private _auth = inject(Auth);
  authState$ = authState(this._auth);
  user$ = user(this._auth);
  idToken$ = idToken(this._auth);


  constructor(private http: HttpClient,private router: Router,     public afAuth: AngularFireAuth,
        public afs: AngularFirestore,) {
        /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }


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
      tap((resData) => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          resData.expiresIn
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
    expiresIn: number,
    displayName: string,
    photoUrl: string,
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


  getAuthToken(): string{
    return environment.OPENAI_API_KEY;
  }
    // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['prompt']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
    // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

    // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
// Send email verfificaiton when new user sign up
  SendVerificationMail() {
      return this.afAuth.currentUser
        .then((u: any) => u.sendEmailVerification())
        .then(() => {
          this.router.navigate(['verify-email-address']);
        });
    }
    // Reset Forggot password
    ForgotPassword(passwordResetEmail: string) {
      return this.afAuth
        .sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert('Password reset email sent, check your inbox.');
        })
        .catch((error) => {
          window.alert(error);
        });
    }


  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }
    // Auth logic to run auth providers
    AuthLogin(provider: any) {
      return this.afAuth
        .signInWithPopup(provider)
        .then((result) => {
          this.router.navigate(['dashboard']);
          this.SetUserData(result.user);
        })
        .catch((error) => {
          window.alert(error);
        });
    }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${user.uid}`
      );
      const userData: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
      };
      return userRef.set(userData, {
        merge: true,
      });
    }

    // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}


