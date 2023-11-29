import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@shared/application/errors/invalid-credentials';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@users/infra/database/in-memory/repositories/users-in-memory.repository';
import { BcryptHashProvider } from '@users/infra/providers/hash-provider/bcrypt-hash.provider';
import { SignInUseCase } from '../../signin.usecase';

describe('SignUpUseCase unit tests', () => {
  let sut: SignInUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: IHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptHashProvider();
    sut = new SignInUseCase.UseCase(repository, hashProvider);
  });

  it('should throw error if not provided an user email', async () => {
    await expect(
      async () => await sut.execute({ email: '', password: 'myPaad' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should throw error if not find an user', async () => {
    await expect(
      async () =>
        await sut.execute({ email: 'some@email.com', password: 'myPaad' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should throw error if not provided an user password', async () => {
    await expect(
      async () =>
        await sut.execute({ email: 'a@test.email.com', password: '' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
  it('should throw an error if user provided invalid credentials', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const hashPassword = await hashProvider.generateHash('/sTr0ngpass23//');

    const entity = new UserEntity(userDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    await expect(
      async () =>
        await sut.execute({
          email: entity.email,
          password: '/sTr0ngpass2//',
        }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should not be able authenticate the user with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('/sTr0ngpass23//');

    const entity = new UserEntity(userDataBuilder({ password: hashPassword }));

    repository.items = [entity];

    await expect(
      async () =>
        await sut.execute({
          email: entity.email,
          password: '/sTr0ngpass2//',
        }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should authenticate the user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const hashPassword = await hashProvider.generateHash('/sTr0ngpass23//');

    const entity = new UserEntity(userDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    const result = await sut.execute({
      email: entity.email,
      password: '/sTr0ngpass23//',
    });

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });
});
