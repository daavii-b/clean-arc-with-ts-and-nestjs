import { Module } from '@nestjs/common';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/infrastructure/users.module';
@Module({
  imports: [EnvConfigModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, EnvConfigService],
})
export class AppModule {}
