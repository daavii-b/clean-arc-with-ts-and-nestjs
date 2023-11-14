import { BaseEntity } from '@shared/domain/entities/entity';
import { IRepository } from './repository-contracts';

export interface ISearchableRepository<
  E extends BaseEntity,
  SearchInput,
  SearchOutput,
> extends IRepository<E> {
  search(props: SearchInput): Promise<SearchOutput>;
}
