import { EntityValidatorError } from '@shared/domain/errors/validation-error';
import { UserEntity, UserProps } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';

describe('UserEntity Integration Tests', () => {
  describe('Constructor Method', () => {
    it('should throw an error when creating an user with invalid name', () => {
      const props: UserProps = {
        ...userDataBuilder({}),
        name: null as string,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidatorError);
    });

    it('should throw an error when creating an user with invalid email', () => {
      const props: UserProps = {
        ...userDataBuilder({}),
        email: null as string,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidatorError);
    });

    it('should throw an error when creating an user with invalid pass', () => {
      const props: UserProps = {
        ...userDataBuilder({}),
        password: null as string,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidatorError);
    });

    it('should throw an error when creating an user with invalid createdAt', () => {
      const props: UserProps = {
        ...userDataBuilder({}),
        createdAt: '2023' as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidatorError);
    });

    it('should create a valid user', () => {
      expect.assertions(0);

      const props: UserProps = {
        ...userDataBuilder({}),
      };

      new UserEntity(props);
    });
  });

  describe('Update Methods', () => {
    describe('Update Name Method', () => {
      it('should throw an error if update the user name with invalid data', () => {
        const entity = new UserEntity(userDataBuilder({}));
        const spyFunction = jest.spyOn(entity, 'updateName');

        expect(() => entity.updateName(12 as any)).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updateName(null as any)).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updateName('')).toThrow(EntityValidatorError);
        expect(() => entity.updateName('a'.repeat(256))).toThrow(
          EntityValidatorError,
        );
        expect(spyFunction).toHaveBeenCalled();
      });

      it('should update the user name', () => {
        const entity = new UserEntity(userDataBuilder({}));
        const spyFunction = jest.spyOn(entity, 'updateName');

        entity.updateName('Another Name');

        expect(entity.name).toBe('Another Name');
        expect(spyFunction).toHaveBeenCalled();
      });
    });
    describe('Update Email Method', () => {
      it('should throw an error if update the user email with invalid data', () => {
        const entity = new UserEntity(userDataBuilder({}));
        const spyFunction = jest.spyOn(entity, 'updateEmail');

        expect(() => entity.updateEmail(12 as any)).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updateEmail(null as any)).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updateEmail('')).toThrow(EntityValidatorError);
        expect(() => entity.updateEmail('a'.repeat(256))).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updateEmail('invalidemail@com')).toThrow(
          EntityValidatorError,
        );

        expect(spyFunction).toHaveBeenCalled();
      });

      it('should update the user email', () => {
        const entity = new UserEntity(userDataBuilder({}));
        const spyFunction = jest.spyOn(entity, 'updateEmail');

        entity.updateEmail('valid_useemail@email.com');

        expect(entity.email).toBe('valid_useemail@email.com');

        expect(spyFunction).toHaveBeenCalled();
      });
    });

    describe('Update Password Method', () => {
      it('should throw an error if update the user password with invalid data', () => {
        const entity = new UserEntity(userDataBuilder({}));
        const spyFunction = jest.spyOn(entity, 'updatePassword');

        expect(() => entity.updatePassword(12 as any)).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updatePassword(null as any)).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updatePassword('')).toThrow(EntityValidatorError);
        expect(() => entity.updatePassword('a'.repeat(256))).toThrow(
          EntityValidatorError,
        );
        expect(() => entity.updatePassword('weakpasswor11')).toThrow(
          EntityValidatorError,
        );

        expect(spyFunction).toHaveBeenCalled();
      });

      it('should update the user password', () => {
        const entity = new UserEntity(userDataBuilder({}));
        const spyFunction = jest.spyOn(entity, 'updatePassword');

        entity.updatePassword('str0NGp@assW0Rd');

        expect(entity.password).toBe('str0NGp@assW0Rd');

        expect(spyFunction).toHaveBeenCalled();
      });
    });
  });
});
