import { BaseEntity } from '@shared/domain/entities/entity';
import { IRepository } from './repository-contracts';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams {
  protected _page?: number;
  protected _perPage = 15;
  protected _sort?: string | null;
  protected _sortDir?: SortDirection | null;
  protected _filter?: string | null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = typeof value === 'boolean' ? this.page : +value;

    if (
      Number.isNaN(_page) ||
      _page <= 0 ||
      parseInt(_page as any) !== _page
    ) {
      _page = 1;
    }

    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = typeof value === 'boolean' ? this.perPage : +value;

    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this.perPage;
    }

    this._perPage = _perPage;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = value ?? false ? `${value}` : null;
  }

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: SortDirection | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter() {
    return this.filter;
  }

  private set filter(value: string | null) {
    this._sort = value ?? false ? `${value}` : null;
  }
}

export interface ISearchableRepository<
  E extends BaseEntity,
  SearchInput,
  SearchOutput,
> extends IRepository<E> {
  search(props: SearchParams): Promise<SearchOutput>;
}