import { UserEntity } from '@domain/entities/user.entity';
import { NUserRepository } from '@domain/repositories/user.repository';
import { ConflictError } from '@shared/domain/errors/conflict-error';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@shared/repositories/in-memory-searchable.repository';
import { SortDirection } from '@shared/repositories/searchable-repository-contract';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements NUserRepository.IRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  protected async applyFilter(
    items: UserEntity[],
    filter: NUserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', sortDir)
      : super.applySort(items, sort, sortDir);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find((item) => item.email === email);

    if (!entity) {
      throw new NotFoundError(`User not found using: ${email}`);
    }

    return entity;
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find((item) => item.email === email);

    if (entity) {
      throw new ConflictError(`Email address already exists`);
    }
  }
}
