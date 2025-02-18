import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../auth.const';
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
  // private _fb = inject(FormBuilder);
  isLoading = false;
  error: string | null = '';
  // registerForm = this._fb.group( /* ...form controls here */ );

  byGoogle(): void {
    // this._service
    //   .byGoogle()
    //   .then(() => /* some logic here */ )
    //   .catch(() => /* some logic here */ );
  }

  byForm(): void {
    // const { email, password } = this.registerForm.value;
       this._service
       .signup('bernestoalberto@gmail.com', 'T0d@y15@B3@t1fuld@y')

  }
  ngOnInit(){}
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs$: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs$ = this._service.signup(email, password);


    authObs$.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
