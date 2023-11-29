import { PrismaClient, User } from '@prisma/client';
import { ValidationError } from '@shared/domain/errors/validation-error';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@users/domain/entities/user.entity';
import { UsersModelMapper } from '../../users-model.mapper';
describe('UserModelMapper Integration Tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setUpPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: '1f754455-8276-42e7-8a96-cc98921fb347',
      name: 'User Test',
      email: 'test@example.com',
      password: '//23FFGtest',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null });
    expect(() => UsersModelMapper.toEntity(model)).toThrowError(
      new ValidationError('An entity cannot be loaded from the database'),
    );
  });
  it('should convert a model into an user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    });

    const sut = UsersModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
