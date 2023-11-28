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
});
