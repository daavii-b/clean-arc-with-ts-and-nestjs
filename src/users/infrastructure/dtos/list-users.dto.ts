import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortDirection } from '@shared/repositories/searchable-repository-contract';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListUsersDto implements ListUsersUseCase.IListUsersInput {
  @ApiPropertyOptional({
    description: 'Page that will be returned',
  })
  @IsOptional()
  @IsString()
  page?: number;

  @ApiPropertyOptional({
    description: 'Quantity of items returned per page',
  })
  @IsOptional()
  @IsString()
  perPage?: number;

  @ApiPropertyOptional({
    description:
      'Value that can be indicate to sort items. acceptable: "name"',
  })
  @IsOptional()
  @IsString()
  sort?: string | null;
  @ApiPropertyOptional({
    description: 'Sort direction',
  })
  @IsOptional()
  @IsString()
  @IsEnum({ asc: 'asc', desc: 'desc' })
  sortDir?: SortDirection | null;

  @ApiPropertyOptional({
    description: 'Value that can be used to filter the results',
  })
  @IsString()
  @IsOptional()
  filter?: string | null;
}
