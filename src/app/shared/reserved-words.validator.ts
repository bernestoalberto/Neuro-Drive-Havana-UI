import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function reservedWordsValidator(reservedWords: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const forbidden = reservedWords.some(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(control.value)
    );
    return forbidden ? { reservedWords: { value: control.value } } : null;
  };
}
