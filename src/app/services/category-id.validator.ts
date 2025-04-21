import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CategoryIdValidator {
  static startsWithLetter(control: AbstractControl): ValidationErrors | null {
    const isValid = /^[a-zA-Z]/.test(control.value);
    return !isValid ? { mustStartWithLetter: true } : null;
  }
}
