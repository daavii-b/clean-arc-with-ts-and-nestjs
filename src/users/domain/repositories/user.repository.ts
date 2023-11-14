import { UserEntity } from '@domain/entities/user.entity';
import { IRepository } from '@shared/repositories/repository-contracts';

export interface IUserRepository extends IRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity>;

  emailExists(email: string): Promise<void>;
}
