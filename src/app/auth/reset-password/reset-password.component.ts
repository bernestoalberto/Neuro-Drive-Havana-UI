import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservedWordInputComponent } from "../../shared/reserved-word-input/reserved-word-input.component";
import { reservedWordsValidator } from '../../shared/reserved-words.validator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, ReservedWordInputComponent, MatCardModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  reservedWords = ['admin', 'root', 'superuser'];

    constructor(private authService: AuthService, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, reservedWordsValidator(this.reservedWords)]]
    });
  }
    ngOnInit(): void {

    }
    sendResetLink() {
      if (this.form.valid && this.form.value.email) {
        this.authService.ForgotPassword(this.form.value.email);
      }
    }
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    }
  }
  }
