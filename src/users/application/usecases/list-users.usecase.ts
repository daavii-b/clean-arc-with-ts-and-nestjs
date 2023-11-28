import { ISearchInput } from '@shared/application/dtos/search-input';
import { IUseCase } from '@shared/application/usecases/use-case';
import { NUserRepository } from '@users/domain/repositories/user.repository';

export namespace ListUsersUseCase {
  export interface IListUsersInput extends ISearchInput {}

  export interface IListUsersOutput {}

  export class UseCase implements IUseCase<IListUsersInput, IListUsersOutput> {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
    ) {}

    async execute(input: IListUsersInput): Promise<IListUsersOutput> {
      // const { id } = input;
      const params = new NUserRepository.SearchParams(input);

      const searchResult = await this.userRepository.search(params);

      return;
    }
  }
}
