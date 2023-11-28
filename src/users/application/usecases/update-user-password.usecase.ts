import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { InvalidPasswordError } from '@shared/application/errors/invalid-password-error';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { IUseCase } from '@shared/application/usecases/use-case';
import {
  IUserOutputDTO,
  UserOutputMapper,
} from '@users/application/dtos/user-output';
import { NUserRepository } from '@users/domain/repositories/user.repository';

export namespace UpdateUserPasswordUseCase {
  export interface IUpdateUserPasswordInput {
    id: string;
    password: string;
    oldPassword: string;
  }

  export interface IUpdateUserPasswordOutput extends IUserOutputDTO {}

  export class UseCase
    implements IUseCase<IUpdateUserPasswordInput, IUpdateUserPasswordOutput>
  {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
      private readonly hashProvider: IHashProvider,
    ) {}

    async execute(
      input: IUpdateUserPasswordInput,
    ): Promise<IUpdateUserPasswordOutput> {
      const { id, password, oldPassword } = input;

      const entity = await this.userRepository.findById(id);

      if (!password || !oldPassword) {
        throw new BadRequestError(
          'Password and old password must be provided',
        );
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        entity.password,
      );

      if (!checkOldPassword) {
        throw new InvalidPasswordError(
          'Invalid old password, password does not match.',
        );
      }

      const hashedPassword = await this.hashProvider.generateHash(password);

      entity.updatePassword(hashedPassword);

      await this.userRepository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
