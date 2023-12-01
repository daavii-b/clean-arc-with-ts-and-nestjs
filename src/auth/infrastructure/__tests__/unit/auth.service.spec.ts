import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { AuthService } from '../../auth.service';

describe('AuthService', () => {
  let sut: AuthService;
  let module: TestingModule;
  let jwtService: JwtService;
  let envConfigService: EnvConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();
    envConfigService = new EnvConfigService(configService);
    jwtService = new JwtService({
      global: true,
      secret: envConfigService.getJWTSecret(),
      signOptions: {
        expiresIn: 86400,
        subject: 'fakeId',
      },
    });
    sut = new AuthService(jwtService, envConfigService);
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, JwtModule],
      providers: [AuthService],
    }).compile();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should returns a jwt', async () => {
    const result = await sut.generateJwt('fakeId');
    expect(Object.keys(result)).toStrictEqual(['accessToken', 'userId']);
    expect(typeof result.accessToken).toEqual('string');
  });

  it('should sign in if token is valid', async () => {
    const result = await sut.generateJwt('fakeId');

    const validateToken = await sut.verifyJwt(result.accessToken);

    expect(validateToken).not.toBeNull();
  });

  it('should throws an error if invalid secret is provided', async () => {
    await expect(
      async () =>
        await sut.verifyJwt(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        ),
    ).rejects.toThrow(JsonWebTokenError);
  });
});
