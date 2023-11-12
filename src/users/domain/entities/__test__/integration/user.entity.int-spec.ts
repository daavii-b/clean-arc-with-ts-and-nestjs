import { UserEntity, UserProps } from '@domain/entities/user.entity';
import { userDataBuilder } from '@domain/testing/helpers/user-data-builder';
import { EntityValidatorError } from '@shared/domain/errors/validation-error';

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
  });
});
