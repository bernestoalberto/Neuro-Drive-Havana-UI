import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule, NgForm, FormControl, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../auth.const';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

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
  isLoading = false;
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
  private router = inject(Router);
  onLogin() {
    if (!this.form.valid) {
      return;
    }
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    let authObs$: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs$ = this._service.login(email, password);


    authObs$.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/prompt']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    this.form.reset();
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
