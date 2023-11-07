import { userDataBuilder } from '@domain/testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator';

let sut: UserValidator;

describe('UserValidator Unit Tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create();
  });
  describe('Name Field Tests', () => {
    it('invalidations cases for name field', async () => {
      let isValid = await sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = await sut.validate({ ...userDataBuilder({}), name: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

      isValid = await sut.validate({
        ...userDataBuilder({}),
        name: 12 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = await sut.validate({
        ...userDataBuilder({}),
        name: 't'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('valid case for name field', async () => {
      const props = userDataBuilder({});

      const isValid = await sut.validate(props);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toStrictEqual({});
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
      expect(sut.validatedData.name).toBeDefined();
      expect(sut.validatedData.name).toBe(props.name);
    });
  });
});