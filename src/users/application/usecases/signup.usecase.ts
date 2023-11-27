import { BadRequestError } from '@application/errors/bad-request-error';
import { UserEntity } from '@domain/entities/user.entity';
import { NUserRepository } from '@domain/repositories/user.repository';
import { IHashProvider } from '@shared/application/providers/hash-provider';

export namespace SignUpUseCase {
  export interface ISignUpInput {
    name: string;
    email: string;
    password: string;
  }

  export interface ISignUpOutput {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  export class UseCase {
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
