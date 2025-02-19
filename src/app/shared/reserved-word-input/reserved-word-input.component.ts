// src/app/shared/reserved-word-input/reserved-word-input.component.ts

import { Component, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reserved-word-input',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './reserved-word-input.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ReservedWordInputComponent {
  @Input() label: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';
  @Input() reservedWords: string[] = [];

  get control(): FormControl {
    return this.formGroupDirective.form.get(this.controlName) as FormControl;
  }

  constructor(private formGroupDirective: FormGroupDirective) {}
}
