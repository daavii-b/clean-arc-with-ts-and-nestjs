import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { PrismaService } from '@shared/infrastructure/database/prisma/prisma.service';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { DeleteUserUseCase } from '@users/application/usecases/delete-user.usecase';
import { GetUserUseCase } from '@users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { SignInUseCase } from '@users/application/usecases/signin.usecase';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import { UpdateUserPasswordUseCase } from '@users/application/usecases/update-user-password.usecase';
import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { AuthModule } from 'src/auth/infrastructure/auth.module';
import { AuthService } from 'src/auth/infrastructure/auth.service';
import { UserPrismaRepository } from './database/prisma/repositories/users-prisma.repository';
import { BcryptHashProvider } from './providers/hash-provider/bcrypt-hash.provider';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'AuthService',
      useFactory: (
        jwtService: JwtService,
        envConfigService: EnvConfigService,
      ) => new AuthService(jwtService, envConfigService),
      inject: [JwtService, EnvConfigService],
    },
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) =>
        new UserPrismaRepository(prismaService),
      inject: [PrismaService],
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
    {
      provide: SignInUseCase.UseCase,
      useFactory: (
        userRepository: NUserRepository.IRepository,
        hashProvider: IHashProvider,
      ) => new SignInUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: NUserRepository.IRepository) =>
        new GetUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory: (userRepository: NUserRepository.IRepository) =>
        new ListUsersUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: NUserRepository.IRepository) =>
        new UpdateUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserPasswordUseCase.UseCase,
      useFactory: (
        userRepository: NUserRepository.IRepository,
        hashProvider: IHashProvider,
      ) => new UpdateUserPasswordUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: NUserRepository.IRepository) =>
        new DeleteUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
