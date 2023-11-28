import { BaseEntity } from '@shared/domain/entities/entity';
import { SearchResult } from '@shared/repositories/searchable-repository-contract';

export interface IPaginationOutput<Item = any> {
  items: Item[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult<BaseEntity>,
  ): IPaginationOutput<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    };
  }
}
