import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { IHashProvider } from '@shared/application/providers/hash-provider';
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
  let provider: IHashProvider;

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
    }).rejects.toThrow(new NotFoundError(`User: fakeId not found `));
  });

  it('should update an user ', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await repository.insert(entity);

    entity.updateName('Other Fake Name');

    const output = await sut.execute(entity);

    expect(output.name).toBe('Other Fake Name');
    expect(output).toStrictEqual(entity.toJSON());
  });
});
