import { SortDirection } from '@shared/repositories/searchable-repository-contract';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListUsersDto implements ListUsersUseCase.IListUsersInput {
  @IsOptional()
  @IsNumber({ allowNaN: false })
  page?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false })
  perPage?: number;

  @IsOptional()
  @IsString()
  sort?: string | null;

  @IsOptional()
  @IsString()
  @IsEnum({ asc: 'asc', desc: 'desc' })
  sortDir?: SortDirection | null;

  @IsString()
  @IsOptional()
  filter?: string | null;
}
