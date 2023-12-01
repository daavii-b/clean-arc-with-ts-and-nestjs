import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@users/infra/database/prisma/repositories/users-prisma.repository';
import { UpdateUserUseCase } from '../../update-user.usecase';

describe('UpdateUseCase Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdateUserUseCase.UseCase;
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
    sut = new UpdateUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw an error if not find an user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fakeId', name: 'fakeName' });
    }).rejects.toThrow(new NotFoundError(`User: fakeId not found`));
  });

  it('should update an user ', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await repository.insert(entity);

    const output = await sut.execute({
      id: entity.id,
      name: 'Other Fake Name',
    });

    const result = await repository.findById(entity.id);

    expect(output.name).toBe('Other Fake Name');
    expect(output).toStrictEqual(result.toJSON());
  });
});
