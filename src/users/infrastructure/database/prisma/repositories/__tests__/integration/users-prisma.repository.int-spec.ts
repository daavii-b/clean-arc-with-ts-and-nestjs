import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '../../users-prisma.repository';
describe('UserPrismaRepository Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws when user not found', async () => {
    await expect(async () => await sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError(`User: fakeId not found `),
    );
  });

  it('should find an user by id', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(result).toStrictEqual(entity.toJSON());
  });
});
