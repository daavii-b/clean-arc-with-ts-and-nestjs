import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { SignUpDto } from '@users/infra/dtos/signup.dto';
import { UsersController } from '@users/infra/users.controller';
import { UsersModule } from '@users/infra/users.module';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from 'src/global-config';
import request from 'supertest';

describe('UsersControllers unit tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: NUserRepository.IRepository;
  let signUpDTO: SignUpDto;

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
    signUpDTO = {
      email: 'test@example.com',
      name: 'User Test',
      password: 'test@123//WE',
    };

    await prismaService.user.deleteMany();
  });

  describe('POST /users', () => {
    it('should create an user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(signUpDTO)
        .expect(201);

      expect(Object.keys(response.body)).toStrictEqual([
        'id',
        'name',
        'email',
        'createdAt',
      ]);

      const user = await repository.findById(response.body.id);
      const presenter = UsersController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(response.body).toStrictEqual(serialized);
    });
  });
});
