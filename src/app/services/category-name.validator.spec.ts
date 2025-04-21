import { CategoryNameValidator } from './category-name.validator';
import { FormControl } from '@angular/forms';

describe('CategoryNameValidator', () => {
  it('should return error if contains special characters', () => {
    const control = new FormControl('Test@!');
    expect(CategoryNameValidator.noSpecialChars(control)).toEqual({ noSpecialChars: true });
  });

  it('should return null for valid name', () => {
    const control = new FormControl('Назва123');
    expect(CategoryNameValidator.noSpecialChars(control)).toBeNull();
  });
});
