import { FieldsError } from '../validators/validator-fields.interface';

export class ValidationError extends Error {}

export class EntityValidatorError extends Error {
  constructor(public error: FieldsError) {
    super('Entity Validation Error');
    this.name = 'EntityValidatorError';
  }
}
