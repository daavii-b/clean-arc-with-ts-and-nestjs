import { SortDirection } from '@shared/repositories/searchable-repository-contract';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';

export class ListUsersDto implements ListUsersUseCase.IListUsersInput {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: string | null;
}
