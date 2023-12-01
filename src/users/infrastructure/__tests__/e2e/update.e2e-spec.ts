import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UpdateUserDto } from '@users/infra/dtos/update-user.dto';
import { UsersController } from '@users/infra/users.controller';
import { UsersModule } from '@users/infra/users.module';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from 'src/global-config';
import request from 'supertest';

describe('UserController End2End', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: NUserRepository.IRepository;
  let updateDTO: UpdateUserDto;

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
    updateDTO = {
      name: 'UserTest',
    };

    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('PUT /users/:id', () => {
    it('should update an user', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await repository.insert(entity);

      const response = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateDTO)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data']);

      const user = await repository.findById(response.body.data.id);
      const presenter = UsersController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(response.body.data).toStrictEqual(serialized);
      expect(response.body.data.name).toStrictEqual(updateDTO.name);
    });

    it('should return 422 status code if invalid request', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await repository.insert(entity);

      const response = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send({})
        .expect(422);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
        'name should not be empty',
      ]);
    });

    it('should return 404 status code when user not found', async () => {
      const response = await request(app.getHttpServer())
        .put('/users/fakeId-test')
        .send(updateDTO)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: `User: fakeId-test not found`,
        });

      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('User: fakeId-test not found');
    });
  });
});
