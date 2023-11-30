import { instanceToPlain } from 'class-transformer';
import { CollectionPresenter } from '../../collection.presenter';
import { PaginationPresenter } from '../../pagination.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('PaginationPresenter Unit Tests', () => {
  let sut: StubCollectionPresenter;

  beforeEach(() => {
    sut = new StubCollectionPresenter({
      currentPage: 1,
      perPage: 6,
      totalPage: 12,
      lastPage: 2,
    });
  });

  describe('constructor method', () => {
    it('should set props value', () => {
      expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter);
      expect(sut['paginationPresenter'].currentPage).toEqual(1);
      expect(sut['paginationPresenter'].perPage).toEqual(6);
      expect(sut['paginationPresenter'].totalPage).toEqual(12);
      expect(sut['paginationPresenter'].lastPage).toEqual(2);
    });

    it('should transform the data to presenter', () => {
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [1, 2, 3],
        meta: {
          currentPage: 1,
          perPage: 6,
          totalPage: 12,
          lastPage: 2,
        },
      });
    });
  });
});
