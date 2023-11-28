import { Module } from '@nestjs/common';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptHashProvider } from './providers/hash-provider/bcrypt-hash.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider,
    },
    {
      provide: SignUpUseCase.UseCase,
      useFactory: (
        userRepository: NUserRepository.IRepository,
        hashProvider: IHashProvider,
      ) => new SignUpUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
  ],
})
export class UsersModule {}
