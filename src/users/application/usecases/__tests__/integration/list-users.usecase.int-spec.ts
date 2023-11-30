import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@users/infra/database/prisma/repositories/users-prisma.repository';
import { ListUsersUseCase } from '../../list-users.usecase';

describe('ListUsersUseCase Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase.UseCase;
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
    sut = new ListUsersUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should returns the users ordered by createdAt ', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];

    const arrange = Array(3).fill(userDataBuilder({}));

    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...element,
          name: `user_${index}`,
          email: `test${index}@example.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map((entity) => entity.toJSON()),
    });

    const output = await sut.execute({});
    expect(output).toStrictEqual({
      items: entities.reverse().map((entity) => entity.toJSON()),
      perPage: 15,
      total: 3,
      currentPage: 1,
      lastPage: 1,
    });
  });

  it('should search using filter, sort and pagination', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];

    const arrange = ['test', 'Test', 'TEST', 'a', 'b'];

    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...userDataBuilder({
            name: element,
          }),
          email: `test${index}@example.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map((entity) => entity.toJSON()),
    });

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'test',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[1].toJSON()],
      perPage: 2,
      total: 3,
      currentPage: 1,
      lastPage: 2,
    });
    expect(output.items[0]).toMatchObject(entities[0].toJSON());
    expect(output.items[1]).toMatchObject(entities[1].toJSON());

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'test',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      perPage: 2,
      total: 3,
      currentPage: 2,
      lastPage: 2,
    });
    expect(output.items[0]).toMatchObject(entities[2].toJSON());
  });
});
