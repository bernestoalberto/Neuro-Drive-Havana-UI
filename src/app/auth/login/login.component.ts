import { Component, inject } from '@angular/core';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../auth.const';
import { Router } from 'express';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  isLoading = false;
  error: string | null = '';
  private _service = inject(AuthService);
  private router = inject(Router);

  onLogin(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs$: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs$ = this._service.login(email, password);


    authObs$.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
