import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { GetUserUseCase } from '@users/application/usecases/get-user.usecase';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@users/infra/database/in-memory/repositories/users-in-memory.repository';

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(repository);
  });

  it('should throw an error if not find an user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fakeId' });
    }).rejects.toThrow(new NotFoundError('Entity not found'));
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
