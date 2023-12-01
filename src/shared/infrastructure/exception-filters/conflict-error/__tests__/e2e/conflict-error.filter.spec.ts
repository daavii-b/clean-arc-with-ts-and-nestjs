import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictError } from '@shared/domain/errors/conflict-error';
import request from 'supertest';
import { ConflictErrorFilter } from '../../conflict-error.filter';

@Controller('stub')
class StubController {
  @Get()
  async index() {
    throw new ConflictError('Conflict Data');
  }
}

describe('ConflictErrorFilter End2End', () => {
  let sut: ConflictErrorFilter;
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalFilters(new ConflictErrorFilter());

    await app.init();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await module.close();
  });
  it('should be defined', () => {
    expect(new ConflictErrorFilter()).toBeDefined();
  });

  it('should catch a ConflictError', () => {
    request(app.getHttpServer()).get('/stubs').expect(409).expect({
      statusCode: 409,
      error: 'Conflict',
      message: 'Conflict Data',
    });
  });
});
