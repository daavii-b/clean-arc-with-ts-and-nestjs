import { BadRequestErrorFilter } from '../../bad-request-error.filter';

describe('BadRequestErrorFilter', () => {
  it('should be defined', () => {
    expect(new BadRequestErrorFilter()).toBeDefined();
  });
});
