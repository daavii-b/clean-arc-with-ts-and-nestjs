import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@users/infra/database/prisma/repositories/users-prisma.repository';
import { DeleteUserUseCase } from '../../delete-user.usecase';

describe('SignUpUseCase Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.$connect();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw an error if not find an user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fakeId' });
    }).rejects.toThrow(new NotFoundError(`User: fakeId not found`));
  });

  it('should delete an user ', async () => {
    const props = userDataBuilder({});
    const entity = new UserEntity(props);

    await repository.insert(entity);

    await sut.execute({ id: entity.id });

    const output = await prismaService.user.findUnique({
      where: { id: entity.id },
    });

    expect(output).toBeNull();
  });
});
