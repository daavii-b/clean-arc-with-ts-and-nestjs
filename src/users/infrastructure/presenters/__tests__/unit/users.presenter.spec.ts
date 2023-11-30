import { PaginationPresenter } from '@shared/infrastructure/presenters/pagination.presenter';
import { instanceToPlain } from 'class-transformer';
import { UserCollectionPresenter, UserPresenter } from '../../users.presenter';

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

describe('UserCollectionPresenter Unit Tests', () => {
  const createdAt = new Date();
  const props = {
    id: '69638f89-c731-475f-9bfd-cd858693d7d0',
    name: 'Test User',
    email: 'test@example.com',
    password: 'm@Pas234/',
    createdAt,
  };
  let sut: UserCollectionPresenter;

  describe('constructor method', () => {
    it('should set props value', () => {
      sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });

      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(sut.data).toEqual([new UserPresenter(props)]);
    });

    it('should transform the data to presenter', () => {
      let sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      let output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [
          {
            id: '69638f89-c731-475f-9bfd-cd858693d7d0',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: createdAt.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });

      sut = new UserCollectionPresenter({
        items: [props],
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      });
      output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [
          {
            id: '69638f89-c731-475f-9bfd-cd858693d7d0',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: createdAt.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });
    });
  });
});
