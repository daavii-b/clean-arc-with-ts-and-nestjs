import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UsersController } from '@users/infra/users.controller';
import { UsersModule } from '@users/infra/users.module';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from 'src/global-config';
import request from 'supertest';

describe('UserController End2End', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: NUserRepository.IRepository;

  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setUpPrismaTests();

    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        DatabaseModule.forTest(prismaService),
        EnvConfigModule,
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    repository = app.get<NUserRepository.IRepository>('UserRepository');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('GET /users', () => {
    it('should returns users ordered by createdAt', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(3).fill(userDataBuilder({}));

      arrange.forEach((entity, index) => {
        entities.push(
          new UserEntity({
            ...entity,
            email: `test${index}@example.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((entity) => entity.toJSON()),
      });

      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams).toString();

      const response = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map((entity) =>
            instanceToPlain(UsersController.userToResponse(entity.toJSON())),
          ),
        meta: { currentPage: 1, lastPage: 1, perPage: 15, total: 3 },
      });
    });

    it('should returns users with filter, pagination and ordered', async () => {
      const entities: UserEntity[] = [];
      const arrange = Array(6).fill(userDataBuilder({}));

      arrange.forEach((entity, index) => {
        entities.push(
          new UserEntity({
            ...entity,
            name: `test-${index}`,
            email: `test${index}@example.com`,
          }),
        );
      });

      entities[5].updateName('otherName');

      await prismaService.user.createMany({
        data: entities.map((entity) => entity.toJSON()),
      });

      let searchParams = {
        filter: 'TEST',
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      };
      let queryParams = new URLSearchParams(searchParams as any).toString();

      let response = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body).toStrictEqual({
        data: [entities[0], entities[1]].map((entity) =>
          instanceToPlain(UsersController.userToResponse(entity.toJSON())),
        ),
        meta: { currentPage: 1, lastPage: 3, perPage: 2, total: 5 },
      });

      searchParams = {
        filter: 'TEST',
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      };
      queryParams = new URLSearchParams(searchParams as any).toString();

      response = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body).toStrictEqual({
        data: [entities[2], entities[3]].map((entity) =>
          instanceToPlain(UsersController.userToResponse(entity.toJSON())),
        ),
        meta: { currentPage: 2, lastPage: 3, perPage: 2, total: 5 },
      });

      searchParams = {
        filter: 'TEST',
        page: 3,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      };
      queryParams = new URLSearchParams(searchParams as any).toString();

      response = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);
      expect(response.body).toStrictEqual({
        data: [entities[4]].map((entity) =>
          instanceToPlain(UsersController.userToResponse(entity.toJSON())),
        ),
        meta: { currentPage: 3, lastPage: 3, perPage: 2, total: 5 },
      });
    });

    it('should return 422 status code when query params is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/?fakeId=test')
        .expect(422);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toStrictEqual([
        'property fakeId should not exist',
      ]);
    });
  });
});
