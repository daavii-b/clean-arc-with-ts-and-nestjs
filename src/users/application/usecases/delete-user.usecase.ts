import { IUseCase } from '@shared/application/usecases/use-case';
import { NUserRepository } from '@users/domain/repositories/user.repository';

export namespace DeleteUserUseCase {
  export interface IDeleteUserInput {
    id: string;
  }

  export type IDeleteUserOutput = void;

  export class UseCase
    implements IUseCase<IDeleteUserInput, IDeleteUserOutput>
  {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
    ) {}

    async execute(input: IDeleteUserInput): Promise<IDeleteUserOutput> {
      const { id } = input;

      await this.userRepository.delete(id);
    }
  }
}
