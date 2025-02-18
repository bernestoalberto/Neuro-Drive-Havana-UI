import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    constructor(private authService: AuthService) {}
    ngOnInit(): void {
      this.resetForm = new FormGroup({
        email: new FormControl('', Validators.required),
      });
    }
    sendResetLink() {
      if (this.resetForm.valid) {
        this.authService.ForgotPassword(this.resetForm.value.email);
      }
    }
  }
