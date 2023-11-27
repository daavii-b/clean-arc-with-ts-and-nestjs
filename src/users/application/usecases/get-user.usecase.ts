import { NUserRepository } from '@domain/repositories/user.repository';

export namespace GetUserUseCase {
  export interface IGetUserInput {
    id: string;
  }

  export interface IGetUserOutput {
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

    async execute(input: IGetUserInput): Promise<IGetUserOutput> {
      const { id } = input;

      const entity = await this.userRepository.findById(id);

      return entity.toJSON();
    }
  }
}