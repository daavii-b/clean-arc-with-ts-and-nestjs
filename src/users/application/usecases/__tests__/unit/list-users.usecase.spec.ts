import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@users/infra/database/in-memory/repositories/user-in-memory.repository';
import { ListUsersUseCase } from '../../list-users.usecase';

describe('ListUsersUseCase unit tests', () => {
  let sut: ListUsersUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(repository);
  });

  it('toOutput method', () => {
    let result = new NUserRepository.SearchResult({
      items: [] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      filter: null,
      sort: null,
      sortDir: null,
    });

    let output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });

    const entity = new UserEntity(userDataBuilder({}));

    result = new NUserRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 1,
      filter: null,
      sort: null,
      sortDir: null,
    });

    output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });
  it('should return the users ordered by createdAt', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(userDataBuilder({ createdAt })),
      new UserEntity(
        userDataBuilder({ createdAt: new Date(createdAt.getTime() + 2) }),
      ),
    ];
    repository.items = items;
    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: [...items].reverse().map((item) => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });
  it('should return the users using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(userDataBuilder({ name: 'A' })),
      new UserEntity(userDataBuilder({ name: 'aA' })),
      new UserEntity(userDataBuilder({ name: 'Ab' })),
      new UserEntity(userDataBuilder({ name: 'b' })),
      new UserEntity(userDataBuilder({ name: 'B' })),
      new UserEntity(userDataBuilder({ name: 'c' })),
    ];

    repository.items = items;

    const output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    });
  });
});
