import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@shared/application/errors/invalid-credentials';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@users/infra/database/prisma/repositories/users-prisma.repository';
import { SignInDto } from '@users/infra/dtos/signin.dto';
import { BcryptHashProvider } from '@users/infra/providers/hash-provider/bcrypt-hash.provider';
import { SignInUseCase } from '../../signin.usecase';

describe('SignUpUseCase Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignInUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let provider: IHashProvider;

  beforeAll(async () => {
    setUpPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.$connect();

    repository = new UserPrismaRepository(prismaService as any);
    provider = new BcryptHashProvider();
  });

  beforeEach(async () => {
    sut = new SignInUseCase.UseCase(repository, provider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw an error if data is not provided', async () => {
    await expect(async () => {
      await sut.execute({ email: '', password: '' });
    }).rejects.toThrow(new BadRequestError('Input data not provided'));
  });

  it('should not authenticate the user if provide invalid credentials ', async () => {
    const oldPassword = await provider.generateHash('//Str0ng123');
    const entity = new UserEntity(
      userDataBuilder({
        password: oldPassword,
      }),
    );

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const props: SignInDto = {
      email: entity.email,
      password: '//Str0ng1',
    };

    await expect(async () => {
      await sut.execute(props);
    }).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should authenticate the user if provide valid credentials ', async () => {
    const oldPassword = await provider.generateHash('//Str0ng123');
    const entity = new UserEntity(
      userDataBuilder({
        password: oldPassword,
      }),
    );

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const props: SignInDto = {
      email: entity.email,
      password: '//Str0ng123',
    };
    const output = await sut.execute(props);

    expect(output).toMatchObject(entity.toJSON());
  });
});
