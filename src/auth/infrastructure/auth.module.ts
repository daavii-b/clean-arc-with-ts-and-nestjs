import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from '@shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { AuthService } from './auth.service';

@Module({
  imports: [
    EnvConfigModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => ({
        global: true,
        secret: envConfigService.getJWTSecret(),
        signOptions: {
          expiresIn: envConfigService.getJWTExpireIn(),
        },
      }),
      inject: [EnvConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
