import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../../users.presenter';

describe('UserPresenter Unit Tests', () => {
  const createdAt = new Date();
  const props = {
    id: '69638f89-c731-475f-9bfd-cd858693d7d0',
    name: 'Test User',
    email: 'test@example.com',
    password: 'm@Pas234/',
    createdAt,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });
  describe('constructor method', () => {
    it('should set props value', () => {
      expect(sut).toBeDefined();
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toBe(props.createdAt);
    });

    it('should transform the data to presenter', () => {
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        id: '69638f89-c731-475f-9bfd-cd858693d7d0',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: createdAt.toISOString(),
      });
    });
  });
});
