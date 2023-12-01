import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InvalidPasswordError } from '@shared/application/errors/invalid-password-error';
import { FastifyReply } from 'fastify';

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: InvalidPasswordError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(400).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: exception.message,
    });
  }
}
