import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const envConfigService = app.get(EnvConfigService);
  await app.listen(envConfigService.getAppPort(), '0.0.0.0');
}
bootstrap();
