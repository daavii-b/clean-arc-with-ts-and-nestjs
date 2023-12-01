import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '../../env-config.module';
import { EnvConfigService } from '../../env-config.service';

describe('EnvConfigService Unit Tests', () => {
  let sut: EnvConfigService; // SUT > System Under Test

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the env variable PORT', () => {
    expect(sut.getAppPort()).toBe(3000);
  });

  it('should return the env variable NODE_ENV', () => {
    expect(sut.getNodeEnv()).toBe('test');
  });

  it('should return the env variable JWT_SECRET', () => {
    expect(sut.getJWTSecret()).toBe('TEST_JWT_SECRET');
  });

  it('should return the env variable JWT_EXPIRE_IN', () => {
    expect(sut.getJWTExpireIn()).toBe(60 * 60 * 24);
  });
});
