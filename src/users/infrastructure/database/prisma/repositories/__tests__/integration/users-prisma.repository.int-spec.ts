import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
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
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newUser.id);

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert an user', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(result).toStrictEqual(entity.toJSON());
  });

  it('should return all users', async () => {
    const entity = new UserEntity(userDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    entities.forEach((item) =>
      expect(item.toJSON()).toStrictEqual(entity.toJSON()),
    );
  });

  describe('Search method tests', () => {
    it('should apply only default params', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];

      const arrange = Array(16).fill(userDataBuilder({}));

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

      const searchOutput = await sut.search(
        new NUserRepository.SearchParams(),
      );

      const items = searchOutput.items.reverse();

      expect(searchOutput).toBeInstanceOf(NUserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items).toHaveLength(searchOutput.perPage);

      searchOutput.items.forEach((item) =>
        expect(item).toBeInstanceOf(UserEntity),
      );

      items.forEach((item, index) => {
        expect(`test${index + 1}@example.com`).toBe(item.email);
      });
    });
    it('should apply filter, sort and pagination', async () => {
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

      const searchOutputPage1 = await sut.search(
        new NUserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'test',
        }),
      );

      expect(searchOutputPage1).toBeInstanceOf(NUserRepository.SearchResult);
      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );

      expect(searchOutputPage1.items).toStrictEqual([
        entities[0],
        entities[1],
      ]);
      expect(searchOutputPage1.items).toHaveLength(searchOutputPage1.perPage);

      const searchOutputPage2 = await sut.search(
        new NUserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'test',
        }),
      );

      expect(searchOutputPage2).toBeInstanceOf(NUserRepository.SearchResult);
      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
      expect(searchOutputPage2.items).toStrictEqual([entities[2]]);
      expect(searchOutputPage2.items).toHaveLength(1);
    });
  });
});
