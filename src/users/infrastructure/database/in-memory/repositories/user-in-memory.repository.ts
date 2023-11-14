import { UserEntity } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { ConflictError } from '@shared/domain/errors/conflict-error';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@shared/repositories/in-memory-searchable.repository copy';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements IUserRepository
{
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
