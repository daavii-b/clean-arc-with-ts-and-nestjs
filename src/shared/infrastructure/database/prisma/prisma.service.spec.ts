import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { setUpPrismaTests } from './testing/setup-prisma-tests';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    setUpPrismaTests();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
