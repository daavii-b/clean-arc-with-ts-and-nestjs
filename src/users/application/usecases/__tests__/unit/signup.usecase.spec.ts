import { BadRequestError } from '@application/errors/bad-request-error';
import { SignUpUseCase } from '@application/usecases/signup.usecase';
import { userDataBuilder } from '@domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@infra/database/in-memory/repositories/user-in-memory.repository';
import { BcryptHashProvider } from '@infra/providers/hash-provider/bcrypt-hash.provider';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { ConflictError } from '@shared/domain/errors/conflict-error';

describe('SignUp UseCase unit tests', () => {
  let sut: SignUpUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: IHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptHashProvider();
    sut = new SignUpUseCase.UseCase(repository, hashProvider);
  });

  it('should create an user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const props = userDataBuilder({});

    const result = await sut.execute({
      email: props.email,
      password: props.password,
      name: props.name,
    });

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('should not be able to register an user with an email that already exists', async () => {
    const props = userDataBuilder({ email: 'test@example.com' });

    await sut.execute(props);

    await expect(async () => await sut.execute(props)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('should throw error if not provided a user name', async () => {
    const props = Object.assign(userDataBuilder({}), {
      name: null,
    });

    await expect(async () => await sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should throw error if not provided a user email', async () => {
    const props = Object.assign(userDataBuilder({}), {
      email: null,
    });

    await expect(async () => await sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it('should throw error if not provided a user password', async () => {
    const props = Object.assign(userDataBuilder({}), {
      password: null,
    });

    await expect(async () => await sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
