import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '@shared/application/errors/bad-request-error';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@users/infra/database/prisma/repositories/users-prisma.repository';
import { BcryptHashProvider } from '@users/infra/providers/hash-provider/bcrypt-hash.provider';
import { UpdateUserPasswordUseCase } from '../../update-user-password.usecase';

describe('UpdateUserPasswordUseCase Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdateUserPasswordUseCase.UseCase;
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
    sut = new UpdateUserPasswordUseCase.UseCase(repository, provider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw an error if not find an user', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await expect(async () => {
      await sut.execute({
        id: 'fakeId',
        password: 'fakePassword',
        oldPassword: entity.password,
      });
    }).rejects.toThrow(new NotFoundError(`User: fakeId not found `));
  });

  it('should throw an error if new password is not provided', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(async () => {
      await sut.execute({
        id: entity.id,
        password: '',
        oldPassword: entity.password,
      });
    }).rejects.toThrow(
      new BadRequestError('Password and old password must be provided'),
    );
  });

  it('should throw an error if old password is not provided', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(async () => {
      await sut.execute({
        id: entity.id,
        password: 'myNewPassword',
        oldPassword: '',
      });
    }).rejects.toThrow(
      new BadRequestError('Password and old password must be provided'),
    );
  });

  it('should update the user password', async () => {
    const oldPassword = await provider.generateHash('//Str0ng123');
    const entity = new UserEntity(
      userDataBuilder({
        password: oldPassword,
      }),
    );

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      id: entity.id,
      password: 'My//p@$$123',
      oldPassword: '//Str0ng123',
    });

    const result = await provider.compareHash('My//p@$$123', output.password);

    expect(result).toBeTruthy();
  });
});
