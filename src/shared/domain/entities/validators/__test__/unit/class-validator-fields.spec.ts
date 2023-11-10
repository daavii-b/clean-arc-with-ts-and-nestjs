import { ClassValidatorFields } from '@shared/domain/entities/validators/class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData variable with null', () => {
    const sut = new StubClassValidatorFields();

    expect(sut.errors).toStrictEqual({});
    expect(sut.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const spyValidate = jest.spyOn(libClassValidator, 'validateSync');

    spyValidate.mockReturnValue([
      {
        property: 'field',
        constraints: { isRequired: 'test error' },
      },
    ]);
    const sut = new StubClassValidatorFields();

    expect(sut.validate(null)).toBeFalsy();
    expect(spyValidate).toHaveBeenCalled();
    expect(sut.validatedData).toBeNull();
    expect(sut.errors).toStrictEqual({
      field: ['test error'],
    });
  });

  it('should validate without errors', () => {
    const spyValidate = jest.spyOn(libClassValidator, 'validateSync');

    spyValidate.mockReturnValue([]);

    const sut = new StubClassValidatorFields();

    expect(sut.validate({ field: 'value' })).toBeTruthy();
    expect(spyValidate).toHaveBeenCalled();
    expect(sut.errors).toStrictEqual({});
    expect(sut.validatedData).toStrictEqual({ field: 'value' });
  });
});
