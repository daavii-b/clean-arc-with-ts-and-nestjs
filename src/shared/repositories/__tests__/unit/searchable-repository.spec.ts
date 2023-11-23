import { SearchParams } from '@shared/repositories/searchable-repository-contract';

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const sut = new SearchParams();

      expect(sut.page).toBe(1);

      const params = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.1, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 3, expected: 3 },
      ];
      params.forEach((param) => {
        expect(new SearchParams({ page: param.page as any }).page).toBe(
          param.expected,
        );
      });
    });

    it('perPage prop', () => {
      const sut = new SearchParams();

      expect(sut.perPage).toBe(15);

      const params = [
        { perPage: null, expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.1, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 3, expected: 3 },
        { perPage: 24, expected: 24 },
      ];
      params.forEach((param) => {
        expect(
          new SearchParams({ perPage: param.perPage as any }).perPage,
        ).toBe(param.expected);
      });
    });

    it('sort prop', () => {
      const sut = new SearchParams();

      expect(sut.sort).toBeNull();

      const params = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 5.1, expected: '5.1' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 3, expected: '3' },
      ];
      params.forEach((param) => {
        expect(new SearchParams({ sort: param.sort as any }).sort).toBe(
          param.expected,
        );
      });
    });

    it('sortDir prop', () => {
      let sut = new SearchParams();

      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({
        sort: null,
      });

      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({
        sort: undefined,
      });

      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({
        sort: '',
      });

      expect(sut.sortDir).toBeNull();

      const params = [
        { sortDir: null, expected: 'desc' },
        { sortDir: undefined, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: -1, expected: 'desc' },
        { sortDir: 5.1, expected: 'desc' },
        { sortDir: true, expected: 'desc' },
        { sortDir: false, expected: 'desc' },
        { sortDir: {}, expected: 'desc' },
        { sortDir: 1, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'DESC', expected: 'desc' },
      ];
      params.forEach((param) => {
        expect(
          new SearchParams({ sort: 'field', sortDir: param.sortDir as any })
            .sortDir,
        ).toBe(param.expected);
      });
    });

    it('filter prop', () => {
      const sut = new SearchParams();
      expect(sut.filter).toBeNull();

      const params = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: '', expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ];

      params.forEach((param) => {
        expect(new SearchParams({ filter: param.filter as any }).filter).toBe(
          param.expected,
        );
      });
    });
  });
});
