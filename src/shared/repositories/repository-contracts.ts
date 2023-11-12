import { BaseEntity } from '@shared/domain/entities/entity';

export interface IRepository<E extends BaseEntity> {
  insert(entity: E): Promise<void>;

  findById(id: string): Promise<E>;

  findAll(): Promise<E[]>;

  update(entity: E): Promise<void>;

  delete(id: string): Promise<void>;
}
