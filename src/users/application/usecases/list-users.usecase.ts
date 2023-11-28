import {
  IPaginationOutput,
  PaginationOutputMapper,
} from '@shared/application/dtos/pagination-output';
import { ISearchInput } from '@shared/application/dtos/search-input';
import { IUseCase } from '@shared/application/usecases/use-case';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { UserOutputMapper } from '../dtos/user-output';

export namespace ListUsersUseCase {
  export interface IListUsersInput extends ISearchInput {}

  export interface IListUsersOutput extends IPaginationOutput {}

  export class UseCase implements IUseCase<IListUsersInput, IListUsersOutput> {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
    ) {}

    async execute(input: IListUsersInput): Promise<IListUsersOutput> {
      // const { id } = input;
      const params = new NUserRepository.SearchParams(input);

      const searchResult = await this.userRepository.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(
      searchResult: NUserRepository.SearchResult,
    ): IListUsersOutput {
      const items = searchResult.items.map((item) =>
        UserOutputMapper.toOutput(item),
      );

      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
