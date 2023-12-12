import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { UsersModule } from '@users/infra/users.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
@Module({
  imports: [
    EnvConfigModule.forRoot(),
    UsersModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    {
      provide: EnvConfigService,
      useFactory: (configService: ConfigService) =>
        new EnvConfigService(configService),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
