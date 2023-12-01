import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { userDataBuilder } from '@users/domain/testing/helpers/user-data-builder';
import { UpdateUserPasswordDto } from '@users/infra/dtos/update-user-password.dto';
import { BcryptHashProvider } from '@users/infra/providers/hash-provider/bcrypt-hash.provider';
import { UsersModule } from '@users/infra/users.module';
import { applyGlobalConfig } from 'src/global-config';
import request from 'supertest';

describe('UserController End2End', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: NUserRepository.IRepository;
  let updatePasswordDTO: UpdateUserPasswordDto;
  let hashProvider: IHashProvider;
  let entity: UserEntity;

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
    hashProvider = new BcryptHashProvider();
  });

  beforeEach(async () => {
    updatePasswordDTO = {
      password: 'test@123//WE',
      oldPassword: 'tESTt@123//@@',
    };

    await prismaService.user.deleteMany();

    const hashPassword = await hashProvider.generateHash(
      updatePasswordDTO.oldPassword,
    );

    entity = new UserEntity(
      userDataBuilder({
        password: hashPassword,
      }),
    );

    await repository.insert(entity);
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('PATCH /users', () => {
    it('should update the user password', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDTO)
        .expect(200);

      expect(Object.keys(response.body)).toStrictEqual(['data']);

      const user = await repository.findById(response.body.data.id);

      const checkNewPassword = await hashProvider.compareHash(
        updatePasswordDTO.password,
        user.password,
      );

      expect(checkNewPassword).toBeTruthy();
    });

    it('should return 404 status code when user not found', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/fakeId`)
        .send(updatePasswordDTO)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: `User: fakeId not found`,
        });

      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('User: fakeId not found');
    });

    it('should return 422 status code when request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send({})
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: [
            'password is not strong enough',
            'password must be shorter than or equal to 100 characters',
            'password must be a string',
            'password should not be empty',
            'oldPassword is not strong enough',
            'oldPassword must be shorter than or equal to 100 characters',
            'oldPassword must be a string',
            'oldPassword should not be empty',
          ],
        });

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toStrictEqual([
        'password is not strong enough',
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
        'password should not be empty',
        'oldPassword is not strong enough',
        'oldPassword must be shorter than or equal to 100 characters',
        'oldPassword must be a string',
        'oldPassword should not be empty',
      ]);
    });

    it('should return 422 status code when password field is invalid', async () => {
      delete updatePasswordDTO.password;
      const response = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDTO)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: [
            'password is not strong enough',
            'password must be shorter than or equal to 100 characters',
            'password must be a string',
            'password should not be empty',
          ],
        });

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toStrictEqual([
        'password is not strong enough',
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
        'password should not be empty',
      ]);
    });

    it('should return 422 status code when oldPassword field is invalid', async () => {
      delete updatePasswordDTO.oldPassword;
      const response = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDTO)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: [
            'oldPassword is not strong enough',
            'oldPassword must be shorter than or equal to 100 characters',
            'oldPassword must be a string',
            'oldPassword should not be empty',
          ],
        });

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toStrictEqual([
        'oldPassword is not strong enough',
        'oldPassword must be shorter than or equal to 100 characters',
        'oldPassword must be a string',
        'oldPassword should not be empty',
      ]);
    });

    it('should return 422 status code when password field is invalid', async () => {
      updatePasswordDTO.oldPassword = 'tESTt@123//@';
      const response = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDTO)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid old password, password does not match.',
        });

      expect(response.body.error).toBe('Unauthorized');
      expect(response.body.message).toStrictEqual(
        'Invalid old password, password does not match.',
      );
    });
  });
});
