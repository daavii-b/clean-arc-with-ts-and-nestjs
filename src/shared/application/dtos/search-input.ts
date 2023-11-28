import { SortDirection } from '@shared/repositories/searchable-repository-contract';

export interface ISearchInput<Filter = string> {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
}
