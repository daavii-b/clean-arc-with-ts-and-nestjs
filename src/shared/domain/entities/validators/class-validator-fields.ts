import { validateSync as validateFields } from 'class-validator';
import { FieldsError, IValidatorFields } from './validator-fields.interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  errors: FieldsError = {};
  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateFields(data);

    if (errors.length) {
      errors.forEach((error) => {
        this.errors[error.property] = Object.values(error.constraints);
      });
    } else {
      this.validatedData = data;
    }

    return !errors.length;
  }
}
