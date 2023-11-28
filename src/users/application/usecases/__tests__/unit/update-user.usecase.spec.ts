import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@users/infra/database/in-memory/repositories/user-in-memory.repository';
import { UpdateUserUseCase } from '../../update-user.usecase';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(repository);
  });

  it('should throw an error if not find an user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fakeId', name: 'fakeName' });
    }).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should throw an error when name is not provided', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fakeId', name: '' });
    }).rejects.toThrow(new BadRequestError('Name must be provided'));
  });

  it('should be able to update the user name', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity({ ...userDataBuilder({}) })];
    repository.items = items;

    const result = await sut.execute({ id: items[0].id, name: 'New Name' });

    expect(spyUpdate).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toMatchObject({
      ...items[0].toJSON(),
      name: 'New Name',
    });
  });
});
