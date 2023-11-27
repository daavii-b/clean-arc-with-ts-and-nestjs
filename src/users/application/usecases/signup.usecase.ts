import { IUserOutputDTO } from '@application/dtos/user-output';
import { UserEntity } from '@domain/entities/user.entity';
import { NUserRepository } from '@domain/repositories/user.repository';
import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { IUseCase } from '@shared/application/usecases/use-case';

export namespace SignUpUseCase {
  export interface ISignUpInput {
    name: string;
    email: string;
    password: string;
  }

  export interface ISignUpOutput extends IUserOutputDTO {}

  export class UseCase implements IUseCase<ISignUpInput, ISignUpOutput> {
    constructor(
      private readonly userRepository: NUserRepository.IRepository,
      private readonly hashProvider: IHashProvider,
    ) {}

    async execute(input: ISignUpInput): Promise<ISignUpOutput> {
      const { email, name, password } = input;

      if (!email || !password || !name) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity(
        Object.assign(input, {
          password: hashPassword,
        }),
      );

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
