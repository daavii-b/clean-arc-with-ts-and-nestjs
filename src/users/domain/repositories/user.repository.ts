import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  ISearchableRepository,
} from '@shared/repositories/searchable-repository-contract';
import { UserEntity } from '@users/domain/entities/user.entity';
export namespace NUserRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}
  export interface IRepository
    extends ISearchableRepository<
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>;

    emailExists(email: string): Promise<void>;
  }
}
