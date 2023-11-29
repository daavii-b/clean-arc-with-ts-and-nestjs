import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { InvalidPasswordError } from '@shared/application/errors/invalid-password-error';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@users/infra/database/in-memory/repositories/users-in-memory.repository';
import { BcryptHashProvider } from '@users/infra/providers/hash-provider/bcrypt-hash.provider';
import { UpdateUserPasswordUseCase } from '../../update-user-password.usecase';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserPasswordUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: IHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptHashProvider();
    sut = new UpdateUserPasswordUseCase.UseCase(repository, hashProvider);
  });

  it('should throw an error if not find an user', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'fakeId',
        password: 'fakeNewPassword',
        oldPassword: 'fakeOldPassword',
      });
      ('');
    }).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should throw an error when password is not provided', async () => {
    const entity = new UserEntity({
      ...userDataBuilder({}),
    });
    repository.items = [entity];

    await expect(async () => {
      await sut.execute({
        id: entity.id,
        password: '',
        oldPassword: 'fakeOldPassword',
      });
    }).rejects.toThrow(
      new BadRequestError('Password and old password must be provided'),
    );
  });

  it('should throw an error when oldPassword is not provided', async () => {
    const entity = new UserEntity({
      ...userDataBuilder({}),
    });
    repository.items = [entity];

    await expect(async () => {
      await sut.execute({
        id: entity.id,
        password: 'fakeNewPassword',
        oldPassword: '',
      });
    }).rejects.toThrow(
      new BadRequestError('Password and old password must be provided'),
    );
  });

  it('should throw an error when oldPassword does not match', async () => {
    const hashPassword = await hashProvider.generateHash('//currentPAs23@@');
    const entity = new UserEntity({
      ...userDataBuilder({
        password: hashPassword,
      }),
    });
    repository.items = [entity];

    await expect(async () => {
      await sut.execute({
        id: entity.id,
        password: 'fakeNewPassword',
        oldPassword: '//currentPAs23',
      });
    }).rejects.toThrow(
      new InvalidPasswordError(
        'Invalid old password, password does not match.',
      ),
    );
  });

  it('should be able to update the user password', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const hashPassword = await hashProvider.generateHash('//currentPAs23@@');

    const entity = new UserEntity({
      ...userDataBuilder({
        password: hashPassword,
      }),
    });
    repository.items = [entity];

    const result = await sut.execute({
      id: entity.id,
      password: 'new@Pass/23455',
      oldPassword: '//currentPAs23@@',
    });

    const checkNewPassword = await hashProvider.compareHash(
      'new@Pass/23455',
      result.password,
    );

    expect(spyUpdate).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(checkNewPassword).toBeTruthy();
  });
});
