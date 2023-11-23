import { BaseEntity } from '@shared/domain/entities/entity';
import { InMemoryRepository } from './in-memory.repository';
import {
  ISearchableRepository,
  SearchParams,
  SearchResult,
} from './searchable-repository-contract';

export abstract class InMemorySearchableRepository<E extends BaseEntity>
  extends InMemoryRepository<E>
  implements ISearchableRepository<E, string, SearchParams, SearchResult<E>>
{
  async search(props: SearchParams): Promise<SearchResult<E>> {
    throw new Error('Method not implemented.');
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {}

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {}
}
