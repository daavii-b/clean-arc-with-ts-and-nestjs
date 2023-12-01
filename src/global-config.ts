import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BadRequestErrorFilter } from '@shared/infrastructure/exception-filters/bad-request-error/bad-request-error.filter';
import { ConflictErrorFilter } from '@shared/infrastructure/exception-filters/conflict-error/conflict-error.filter';
import { InvalidPasswordErrorFilter } from '@shared/infrastructure/exception-filters/invalid-password-error/invalid-password-error.filter';
import { NotFoundErrorFilter } from '@shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';
import { WrappedDataInterceptor } from '@shared/infrastructure/interceptors/wrapped-data/wrapped-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrappedDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new BadRequestErrorFilter(),
    new InvalidPasswordErrorFilter(),
  );
}
