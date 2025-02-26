import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  TransferState,
  PLATFORM_ID,
  makeStateKey,
  OnDestroy,
} from '@angular/core';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import {
  ReactiveFormsModule,
  NgForm,
  FormControl,
  FormGroupDirective,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  tap,
  startWith,
  from,
  Observable,
  switchMap,
} from 'rxjs';
import {
  Auth,
  beforeAuthStateChanged,
  onAuthStateChanged,
  onIdTokenChanged,
  signInAnonymously,
  User,
} from '@angular/fire/auth';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import cookies from 'js-cookie';
import { ɵzoneWrap } from '@angular/fire';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
function _authState(auth: Auth): Observable<User | null> {
  return from(auth.authStateReady()).pipe(
    switchMap(
      () =>
        new Observable<User | null>((subscriber) => {
          const unsubscribe = onAuthStateChanged(
            auth,
            subscriber.next.bind(subscriber),
            subscriber.error.bind(subscriber),
            subscriber.complete.bind(subscriber)
          );
          return { unsubscribe };
        })
    )
  );
}

export const eAuthState = ɵzoneWrap(_authState, true);

@Component({
  selector: 'app-auth',

  imports: [
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnDestroy {
  isLoading = new BehaviorSubject(false);
  private readonly auth = inject(Auth);
  protected readonly authState = eAuthState(this.auth);

  private readonly transferState = inject(TransferState);
  private readonly transferStateKey = makeStateKey<string | undefined>(
    'auth:uid'
  );

  protected readonly uid = this.authState
    .pipe(map((u) => u?.uid))
    .pipe(
      isPlatformServer(inject(PLATFORM_ID))
        ? tap((it) => this.transferState.set(this.transferStateKey, it))
        : this.transferState.hasKey(this.transferStateKey)
          ? startWith(this.transferState.get(this.transferStateKey, undefined))
          : tap()
    );

  protected readonly showLoginButton = this.uid.pipe(map((it) => !it));
  protected readonly showLogoutButton = this.uid.pipe(map((it) => !!it));

  private readonly unsubscribeFromOnIdTokenChanged: (() => void) | undefined;
  private readonly unsubscribeFromBeforeAuthStateChanged:
    | (() => void)
    | undefined;

  form = new FormGroup({
    password: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  passwordControl = 'password';
  emailControl = 'email';

  hide = signal(true);

  matcher = new MyErrorStateMatcher();
  error: string | null = '';
  private _service = inject(AuthService);
  router = inject(Router);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromBeforeAuthStateChanged?.();
    this.unsubscribeFromOnIdTokenChanged?.();
  }
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.unsubscribeFromOnIdTokenChanged = onIdTokenChanged(
        this.auth,
        async (user) => {
          if (user) {
            const idToken = await user.getIdToken();
            cookies.set('__session', idToken);
          } else {
            cookies.remove('__session');
          }
        }
      );

      let priorCookieValue: string | undefined;
      this.unsubscribeFromBeforeAuthStateChanged = beforeAuthStateChanged(
        this.auth,
        async (user) => {
          priorCookieValue = cookies.get('__session');
          const idToken = await user?.getIdToken();
          if (idToken) {
            cookies.set('__session', idToken);
          } else {
            cookies.remove('__session');
          }
        },
        async () => {
          // If another beforeAuthStateChanged rejects, revert the cookie (best-effort)
          if (priorCookieValue) {
            cookies.set('__session', priorCookieValue);
          } else {
            cookies.remove('__session');
          }
        }
      );
    }
  }

  login() {
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    this.isLoading.next(true);
    this._service
      .Login(email, password)
      .pipe(catchError(this._service.handleError))
      .subscribe({
        next: (user) => {
          const myUser = user.user;
          const { email, photoURL, uid } = myUser;
          const token = myUser.accessToken;
          this.isLoading.next(false);
          this._service.handleAuthentication(email, uid, token, 500, photoURL);
          // redirect to profile page
          this.router.navigateByUrl('/user-profile');
        },
      });
  }
  loginGoogle() {
    this.isLoading.next(true);
    this._service
      .LoginGoogle()
      .pipe(catchError(this._service.handleError))
      .subscribe({
        next: (user) => {
          const myUser = user.user;
          const { email, photoURL, uid } = myUser;
          const token = myUser.accessToken;
          this._service.handleAuthentication(email, uid, token, 500, photoURL);
          this.isLoading.next(false);
          this.router.navigateByUrl('/user-profile');
        },
      });
  }
  get shouldSpinnerRun() {
    return this.isLoading.value;
  }
  async loginAnonymously() {
    return await signInAnonymously(this.auth);
  }
}
