export type FieldsError = {
  [field: string]: string[];
};

export interface IValidatorFields<PropsValidated> {
  errors: FieldsError;
  validatedData: PropsValidated;

  validate: (data: any) => Promise<boolean>;
}
