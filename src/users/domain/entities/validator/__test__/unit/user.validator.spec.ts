import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
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
    it('invalidations cases for name field', () => {
      let isValid = sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({ ...userDataBuilder({}), name: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

      isValid = sut.validate({
        ...userDataBuilder({}),
        name: 12 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...userDataBuilder({}),
        name: 't'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('valid case for name field', () => {
      const props = userDataBuilder({});

      const isValid = sut.validate(props);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toStrictEqual({});
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
      expect(sut.validatedData.name).toBeDefined();
      expect(sut.validatedData.name).toBe(props.name);
    });
  });

  describe('Email Field Tests', () => {
    it('invalidations cases for Email field', () => {
      let isValid = sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
        'email must be a string',
        'email should not be empty',
      ]);

      isValid = sut.validate({ ...userDataBuilder({}), email: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
      ]);

      isValid = sut.validate({
        ...userDataBuilder({}),
        email: 12 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
        'email must be a string',
      ]);

      isValid = sut.validate({
        ...userDataBuilder({}),
        email: 't'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be shorter than or equal to 255 characters',
        'email must be an email',
      ]);
    });

    it('valid case for email field', () => {
      const props = userDataBuilder({});

      const isValid = sut.validate(props);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toStrictEqual({});
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
      expect(sut.validatedData.email).toBeDefined();
      expect(sut.validatedData.email).toBe(props.email);
    });
  });
  describe('Password Field Tests', () => {
    it('invalidations cases for Password field', () => {
      let isValid = sut.validate(null as any);

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password is not strong enough',
        'password must be a string',
        'password should not be empty',
      ]);

      isValid = sut.validate({ ...userDataBuilder({}), password: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password is not strong enough',
        'password should not be empty',
      ]);

      isValid = sut.validate({
        ...userDataBuilder({}),
        password: 12 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password is not strong enough',
        'password must be a string',
      ]);

      isValid = sut.validate({
        ...userDataBuilder({}),
        password: 'weakPass',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password is not strong enough',
      ]);
    });

    it('valid case for Password field', () => {
      const props = userDataBuilder({});

      const isValid = sut.validate(props);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toStrictEqual({});
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
      expect(sut.validatedData.password).toBeDefined();
      expect(sut.validatedData.password).toBe(props.password);
    });
  });

  describe('CreatedAt Field Tests', () => {
    it('invalidations cases for CreatedAt field', () => {
      const props = userDataBuilder({});

      let isValid = sut.validate({ ...props, createdAt: 10 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);

      isValid = sut.validate({ ...props, createdAt: '2023' as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });

    it('valid case for createdAt field', () => {
      const props = userDataBuilder({
        createdAt: new Date(),
      });

      const isValid = sut.validate(props);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toStrictEqual({});
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
      expect(sut.validatedData.createdAt).toBeDefined();
      expect(sut.validatedData.createdAt).toBe(props.createdAt);
      expect(sut.validatedData.createdAt).toBeInstanceOf(Date);
    });
  });
});
