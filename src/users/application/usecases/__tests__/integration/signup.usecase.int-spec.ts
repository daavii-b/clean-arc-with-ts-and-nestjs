import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { IHashProvider } from '@shared/application/providers/hash-provider';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { setUpPrismaTests } from '@shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@users/infra/database/prisma/repositories/users-prisma.repository';
import { SignUpDto } from '@users/infra/dtos/signup.dto';
import { BcryptHashProvider } from '@users/infra/providers/hash-provider/bcrypt-hash.provider';
import { SignUpUseCase } from '../../signup.usecase';

describe('SignUpUseCase Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignUpUseCase.UseCase;
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
    provider = new BcryptHashProvider();
  });

  beforeEach(async () => {
    sut = new SignUpUseCase.UseCase(repository, provider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should create an user ', async () => {
    const props: SignUpDto = {
      email: 'test@example.com',
      name: 'test',
      password: 'myStr0ng123//',
    };
    const output = await sut.execute(props);

    expect(output).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
