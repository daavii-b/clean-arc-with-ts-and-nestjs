import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { IUseCase } from '@shared/application/usecases/use-case';
import {
  IUserOutputDTO,
  UserOutputMapper,
} from '@users/application/dtos/user-output';
import { NUserRepository } from '@users/domain/repositories/user.repository';

export namespace UpdateUserUseCase {
  export interface IUpdateUserInput {
    id: string;
    name: string;
  }

  export interface IUpdateUserOutput extends IUserOutputDTO {}

  export class UseCase
    implements IUseCase<IUpdateUserInput, IUpdateUserOutput>
  {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
    ) {}

    async execute(input: IUpdateUserInput): Promise<IUpdateUserOutput> {
      const { id, name } = input;

      if (!name) {
        throw new BadRequestError('Name must be provided');
      }

      const entity = await this.userRepository.findById(id);

      entity.updateName(name);

      await this.userRepository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
