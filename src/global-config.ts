import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WrappedDataInterceptor } from '@shared/infrastructure/interceptors/wrapped-data/wrapped-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new WrappedDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
