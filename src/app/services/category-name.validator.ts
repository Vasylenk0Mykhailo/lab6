import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CategoryNameValidator {
  static noSpecialChars(control: AbstractControl): ValidationErrors | null {
    const forbidden = /[^a-zA-Zа-яА-Я0-9\s]/.test(control.value);
    return forbidden ? { noSpecialChars: true } : null;
  }
}
