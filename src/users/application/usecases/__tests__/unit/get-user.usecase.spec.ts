import { GetUserUseCase } from '@application/usecases/get-user.usecase';
import { UserEntity } from '@domain/entities/user.entity';
import { userDataBuilder } from '@domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@infra/database/in-memory/repositories/user-in-memory.repository';
import { NotFoundError } from '@shared/domain/errors/not-found-error';

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(repository);
  });

  it('should throw an error if not find an user', async () => {
    await expect(
      async () => await sut.execute({ id: 'fakeId' }),
    ).rejects.toBeInstanceOf(new NotFoundError('Entity not found'));
  });

  it('should be able to find an user by id', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    const items = [new UserEntity({ ...userDataBuilder({}) })];
    repository.items = items;

    const result = await sut.execute({ id: items[0].id });

    expect(spyFindById).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toMatchObject({
      ...items[0].toJSON(),
    });
  });
});
