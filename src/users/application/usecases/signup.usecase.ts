import { BadRequestError } from '@application/errors/bad-request-error';
import { UserEntity } from '@domain/entities/user.entity';
import { NUserRepository } from '@domain/repositories/user.repository';

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
    ) {}

    async execute(input: ISignUpInput): Promise<ISignUpOutput> {
      const { email, name, password } = input;

      if (!email || !password || !name) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);

      const entity = new UserEntity(input);

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
