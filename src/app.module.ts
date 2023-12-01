import { Module } from '@nestjs/common';
import { UsersModule } from '@users/infra/users.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
@Module({
  imports: [EnvConfigModule, UsersModule, DatabaseModule, AuthModule],
})
export class AppModule {}
