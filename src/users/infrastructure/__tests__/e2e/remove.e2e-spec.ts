import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UsersModule } from '@users/infra/users.module';
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

  describe('DELETE /users/:id', () => {
    it('should delete an user', async () => {
      const entity = new UserEntity(userDataBuilder({}));
      await repository.insert(entity);
      await request(app.getHttpServer())
        .delete(`/users/${entity.id}`)
        .expect(204)
        .expect({});
    });

    it('should return 404 status code when user not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/fakeId-test')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: `User: fakeId-test not found`,
        });

      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('User: fakeId-test not found');
    });

    // it('should return 422 status code when email field is invalid', async () => {
    //   delete signUpDTO.email;
    //   const response = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpDTO)
    //     .expect(422);

    //   expect(response.body.error).toBe('Unprocessable Entity');
    //   expect(response.body.message).toStrictEqual([
    //     'email must be an email',
    //     'email must be shorter than or equal to 255 characters',
    //     'email must be a string',
    //     'email should not be empty',
    //   ]);
    // });

    // it('should return 422 status code when password field is invalid', async () => {
    //   delete signUpDTO.password;
    //   const response = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpDTO)
    //     .expect(422);

    //   expect(response.body.error).toBe('Unprocessable Entity');
    //   expect(response.body.message).toStrictEqual([
    //     'password is not strong enough',
    //     'password must be shorter than or equal to 100 characters',
    //     'password must be a string',
    //     'password should not be empty',
    //   ]);
    // });

    // it('should return 422 status code when receive unexpected field', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(Object.assign(signUpDTO, { test: 'test' }))
    //     .expect(422);

    //   expect(response.body.error).toBe('Unprocessable Entity');
    //   expect(response.body.message).toStrictEqual([
    //     'property test should not exist',
    //   ]);
    // });

    // it('should return 409 status code when email already exists', async () => {
    //   const entity = new UserEntity(userDataBuilder({ ...signUpDTO }));
    //   await repository.insert(entity);
    //   const response = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpDTO)
    //     .expect(409)
    //     .expect({
    //       statusCode: 409,
    //       error: 'Conflict',
    //       message: 'Email already exists',
    //     });

    //   expect(response.body.error).toBe('Conflict');
    // });
  });
});
