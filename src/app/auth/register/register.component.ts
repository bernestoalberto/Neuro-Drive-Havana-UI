import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";


@Component({
    selector: 'app-register',

    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule]
})
export class RegisterComponent {
  private _service = inject(AuthService);
  private router = inject(Router);
  isLoading = false;
  error: string | null = '';

  ngOnInit(){}
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this._service.Signup(email, password);

    form.reset();
  }

  signUp(form: NgForm) {
    const email = form.value.email ?? '';
    const password = form.value.password ?? '';
    this.isLoading = true;
    this._service
      .Signup(email, password)
      .pipe(
        catchError(this._service.handleError),
      )
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          this.router.navigateByUrl('/login');
        }
      });
  }

}
