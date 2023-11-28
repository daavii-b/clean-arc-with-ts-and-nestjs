import { IUseCase } from '@shared/application/usecases/use-case';
import {
  IUserOutputDTO,
  UserOutputMapper,
} from '@users/application/dtos/user-output';
import { NUserRepository } from '@users/domain/repositories/user.repository';

export namespace GetUserUseCase {
  export interface IGetUserInput {
    id: string;
  }

  export interface IGetUserOutput extends IUserOutputDTO {}

  export class UseCase implements IUseCase<IGetUserInput, IGetUserOutput> {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
    ) {}

    async execute(input: IGetUserInput): Promise<IGetUserOutput> {
      const { id } = input;

      const entity = await this.userRepository.findById(id);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
