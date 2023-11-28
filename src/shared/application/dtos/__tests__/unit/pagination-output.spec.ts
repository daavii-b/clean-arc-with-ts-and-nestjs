import { SearchResult } from '@shared/repositories/searchable-repository-contract';
import { PaginationOutputMapper } from '../../pagination-output';

describe('PaginationOutputMapper unit tests', () => {
  it('should convert a SearchResult in output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      filter: 'fake',
      sort: null,
      sortDir: null,
    });

    const sut = PaginationOutputMapper.toOutput(result.items, result);

    expect(sut).toStrictEqual({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });
});
