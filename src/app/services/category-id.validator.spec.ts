import { CategoryIdValidator } from './category-id.validator';
import { FormControl } from '@angular/forms';

describe('CategoryIdValidator', () => {
  it('should return error if ID does not start with letter', () => {
    const control = new FormControl('123abc');
    expect(CategoryIdValidator.startsWithLetter(control)).toEqual({ mustStartWithLetter: true });
  });

  it('should return null if ID starts with letter', () => {
    const control = new FormControl('A123');
    expect(CategoryIdValidator.startsWithLetter(control)).toBeNull();
  });
});
