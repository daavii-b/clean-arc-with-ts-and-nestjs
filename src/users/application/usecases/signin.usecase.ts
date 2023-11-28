import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@shared/application/errors/invalid-credentials';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { IUseCase } from '@shared/application/usecases/use-case';
import {
  IUserOutputDTO,
  UserOutputMapper,
} from '@users/application/dtos/user-output';
import { NUserRepository } from '@users/domain/repositories/user.repository';

export namespace SignInUseCase {
  export interface ISignInInput {
    email: string;
    password: string;
  }

  export interface ISignInOutput extends IUserOutputDTO {}

  export class UseCase implements IUseCase<ISignInInput, ISignInOutput> {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
      private readonly hashProvider: IHashProvider,
    ) {}

    async execute(input: ISignInInput): Promise<ISignInOutput> {
      const { email, password } = input;

      if (!email || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = await this.userRepository.findByEmail(email);

      const checkIsValidPassword = await this.hashProvider.compareHash(
        password,
        entity.password,
      );

      if (!checkIsValidPassword) {
        throw new InvalidCredentialsError('Invalid credentials');
      }

      return UserOutputMapper.toOutput(entity);
    }
  }
}
