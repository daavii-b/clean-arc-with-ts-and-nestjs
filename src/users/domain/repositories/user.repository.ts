import { UserEntity } from '@domain/entities/user.entity';
import { ISearchableRepository } from '@shared/repositories/searchable-repository-contract';

export interface IUserRepository
  extends ISearchableRepository<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>;

  emailExists(email: string): Promise<void>;
}
