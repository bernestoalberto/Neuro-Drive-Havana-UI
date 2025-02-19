import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule, NgForm, FormControl, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError } from 'rxjs';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',

  imports: [
    LoadingSpinnerComponent, ReactiveFormsModule, MatFormFieldModule,  MatInputModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  isLoading = new BehaviorSubject(false);
  form = new FormGroup({
    password: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email])
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
  login() {
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    this.isLoading.next(true);
    this._service
      .Login(email, password)
         .pipe(
              catchError(this._service.handleError),
            )
      .subscribe({
        next: (user) => {
          const myUser = user.user;
          const {email, photoURL, uid} = myUser;
          const token = myUser.accessToken;
          this.isLoading.next(false);
          this._service.handleAuthentication(email, uid , token, 50 , photoURL);
          // redirect to profile page
          this.router.navigateByUrl('/user-profile');
        }
      });
  }
  loginGoogle() {
    this.isLoading.next(true);
    this._service
      .LoginGoogle()
      .pipe(
        catchError(this._service.handleError),
      )
      .subscribe({
        next: (user) => {
          const myUser = user.user;
          const {email, photoURL, uid} = myUser;
          const token = myUser.accessToken;
          this._service.handleAuthentication(email, uid , token, 50 , photoURL);
          this.isLoading.next(false);
          this.router.navigateByUrl('/user-profile');
        }
      });
  }
   get shouldSpinnerRun(){
    return this.isLoading.value;
   }
}
