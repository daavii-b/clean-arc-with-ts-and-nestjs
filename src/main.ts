import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from '@shared/infrastructure/env-config/env-config.service';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const envConfigService = app.get(EnvConfigService);

  const config = new DocumentBuilder()
    .setTitle('Clean Arch with Node')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Provide JWT Token to enable access',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);

  await app.listen(envConfigService.getAppPort(), '0.0.0.0');
}
bootstrap();
