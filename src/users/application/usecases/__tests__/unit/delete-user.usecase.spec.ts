import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@users/infra/database/in-memory/repositories/user-in-memory.repository';
import { DeleteUserUseCase } from '../../delete-user.usecase';

describe('GetUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUserUseCase.UseCase(repository);
  });

  it('should throw an error if not find an user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fakeId' });
    }).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should be able to delete an user', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const entity = new UserEntity({
      ...userDataBuilder({}),
    });
    repository.items = [entity];

    expect(repository.items).toHaveLength(1);

    const result = await sut.execute({ id: entity.id });

    expect(spyDelete).toHaveBeenCalled();
    expect(repository.items).toHaveLength(0);
  });
});
