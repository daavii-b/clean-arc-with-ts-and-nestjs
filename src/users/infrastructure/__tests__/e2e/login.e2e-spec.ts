import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { SignInDto } from '@users/infra/dtos/signin.dto';
import { UsersController } from '@users/infra/users.controller';
import { UsersModule } from '@users/infra/users.module';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from 'src/global-config';
import request from 'supertest';

describe('UserController End2End', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: NUserRepository.IRepository;
  let signInDTO: SignInDto;

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
    signInDTO = {
      email: 'test@example.com',
      password: 'test@123//WE',
    };

    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('POST /users', () => {
    it('should authenticate an user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send(signInDTO)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data']);

      const user = await repository.findById(response.body.data.id);
      const presenter = UsersController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(response.body.data).toStrictEqual(serialized);
    });

    // it('should return 422 status code if invalid request', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/users')
    //     .send({})
    //     .expect(422);

    //   expect(response.body.error).toBe('Unprocessable Entity');
    //   expect(response.body.message).toStrictEqual([
    //     'name must be shorter than or equal to 255 characters',
    //     'name must be a string',
    //     'name should not be empty',
    //     'email must be an email',
    //     'email must be shorter than or equal to 255 characters',
    //     'email must be a string',
    //     'email should not be empty',
    //     'password is not strong enough',
    //     'password must be shorter than or equal to 100 characters',
    //     'password must be a string',
    //     'password should not be empty',
    //   ]);
    // });

    // it('should return 422 status code when email field is invalid', async () => {
    //   delete signInDTO.email;
    //   const response = await request(app.getHttpServer())
    //     .post('/users/login')
    //     .send(signInDTO)
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
    //   delete signInDTO.password;
    //   const response = await request(app.getHttpServer())
    //     .post('/users/login')
    //     .send(signInDTO)
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
    //     .post('/users/login')
    //     .send(Object.assign(signInDTO, { test: 'test' }))
    //     .expect(422);

    //   expect(response.body.error).toBe('Unprocessable Entity');
    //   expect(response.body.message).toStrictEqual([
    //     'property test should not exist',
    //   ]);
    // });
  });
});
