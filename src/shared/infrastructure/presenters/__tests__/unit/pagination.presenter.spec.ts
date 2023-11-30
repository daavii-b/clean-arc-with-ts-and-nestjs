import { instanceToPlain } from 'class-transformer';
import {
  PaginationPresenter,
  PaginationPresenterProps,
} from '../../pagination.presenter';

describe('PaginationPresenter Unit Tests', () => {
  let props: PaginationPresenterProps = {
    currentPage: 1,
    perPage: 6,
    total: 12,
    lastPage: 2,
  };
  let sut: PaginationPresenter;

  beforeEach(() => {
    sut = new PaginationPresenter(props);
  });

  describe('constructor method', () => {
    it('should set props value', () => {
      expect(sut).toBeDefined();
      expect(sut.currentPage).toEqual(props.currentPage);
      expect(sut.perPage).toEqual(props.perPage);
      expect(sut.total).toEqual(props.total);
      expect(sut.lastPage).toEqual(props.lastPage);
    });

    it('should set props value as string', () => {
      props = {
        currentPage: '1' as any,
        perPage: '6' as any,
        total: '12' as any,
        lastPage: '2' as any,
      };
      sut = new PaginationPresenter(props);
      expect(sut).toBeDefined();
      expect(sut.currentPage).toBe(props.currentPage);
      expect(sut.perPage).toBe(props.perPage);
      expect(sut.total).toBe(props.total);
      expect(sut.lastPage).toBe(props.lastPage);
    });

    it('should transform the data to presenter', () => {
      props = {
        currentPage: '1' as any,
        perPage: '6' as any,
        total: '12' as any,
        lastPage: '2' as any,
      };
      sut = new PaginationPresenter(props);
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        perPage: 6,
        total: 12,
        lastPage: 2,
      });
    });
  });
});
