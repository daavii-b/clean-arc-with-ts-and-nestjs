import { validate as validateFields } from 'class-validator';
import { FieldsError, IValidatorFields } from './validator-fields.interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  constructor(props: PropsValidated) {}
  errors: FieldsError = {};
  validatedData: PropsValidated = null;

  async validate(data: any): Promise<boolean> {
    const errors = await validateFields(data);

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
