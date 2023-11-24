import { BaseEntity } from '@shared/domain/entities/entity';
import { InMemorySearchableRepository } from '@shared/repositories/in-memory-searchable.repository';
import {
  SearchParams,
  SearchResult,
} from '@shared/repositories/searchable-repository-contract';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends BaseEntity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: StubEntity[],
    filter: string,
  ): Promise<StubEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

describe('InMemorySearchableRepository unit test', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'TestEntity', price: 1.2 })];
      const spyFilterMethod = jest.spyOn(items, 'filter');

      const itemsFiltered = await sut['applyFilter'](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter items using filter param', async () => {
      const items = [
        new StubEntity({ name: 'TestEntity', price: 1.2 }),
        new StubEntity({ name: 'testentity', price: 1.2 }),
        new StubEntity({ name: 'entity', price: 1.5 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter');

      let itemsFiltered = await sut['applyFilter'](items, 'TEST');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalled();
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut['applyFilter'](items, 'test');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalled();
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await sut['applyFilter'](items, 'empty-filter');

      expect(itemsFiltered).toStrictEqual([]);
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalled();
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });
  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1.2 }),
        new StubEntity({ name: 'a', price: 1.2 }),
      ];

      const spySortMethod = jest.spyOn(items, 'sort');

      let itemsSorted = await sut['applySort'](items, null, null);

      expect(itemsSorted).toStrictEqual(items);
      expect(spySortMethod).not.toHaveBeenCalled();

      itemsSorted = await sut['applySort'](items, 'price', 'asc');

      expect(itemsSorted).toStrictEqual(items);
      expect(spySortMethod).not.toHaveBeenCalled();
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1.2 }),
        new StubEntity({ name: 'c', price: 1.2 }),
        new StubEntity({ name: 'a', price: 1.2 }),
      ];

      let itemsSorted = await sut['applySort'](items, 'name', 'asc');

      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

      itemsSorted = await sut['applySort'](items, 'name', 'desc');

      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
    });
  });
  describe('applyPagination method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1.2 }),
        new StubEntity({ name: 'c', price: 1.2 }),
        new StubEntity({ name: 'a', price: 1.2 }),
        new StubEntity({ name: 'd', price: 1.2 }),
        new StubEntity({ name: 'f', price: 1.2 }),
        new StubEntity({ name: 'e', price: 1.2 }),
      ];

      let itemsPaginated = await sut['applyPagination'](items, 1, 2);

      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await sut['applyPagination'](items, 2, 2);

      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await sut['applyPagination'](items, 3, 2);

      expect(itemsPaginated).toStrictEqual([items[4], items[5]]);

      itemsPaginated = await sut['applyPagination'](items, 4, 2);

      expect(itemsPaginated).toStrictEqual([]);
    });
  });
  describe('search method', () => {
    it('should apply only pagination when other param are null', async () => {
      const entity = new StubEntity({ name: 'TestEntity', price: 1.2 });
      const items = Array(16).fill(entity);

      sut.items = items;

      const params = await sut.search(new SearchParams());

      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          filter: null,
          perPage: 15,
          sort: null,
          sortDir: null,
          currentPage: 1,
        }),
      );
    });

    it('should apply pagination and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1.2 }),
        new StubEntity({ name: 'c', price: 1.2 }),
        new StubEntity({ name: 'a', price: 1.2 }),
        new StubEntity({ name: 'TEST', price: 1.2 }),
        new StubEntity({ name: 'f', price: 1.2 }),
        new StubEntity({ name: 'teST', price: 1.2 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'test',
        }),
      );

      expect(params).toBeInstanceOf(SearchResult);

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[3]],
          total: 3,
          filter: 'test',
          perPage: 2,
          sort: null,
          sortDir: null,
          currentPage: 1,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'test',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[5]],
          total: 3,
          filter: 'test',
          perPage: 2,
          sort: null,
          sortDir: null,
          currentPage: 2,
        }),
      );
    });

    it('should apply pagination and sort', async () => {
      const items = [
        new StubEntity({ name: 'd', price: 1.2 }),
        new StubEntity({ name: 'c', price: 1.2 }),
        new StubEntity({ name: 'a', price: 1.2 }),
        new StubEntity({ name: 'e', price: 1.2 }),
        new StubEntity({ name: 'f', price: 1.2 }),
        new StubEntity({ name: 'b', price: 1.2 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[3]],
          total: items.length,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[1]],
          total: items.length,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[5], items[2]],
          total: items.length,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[2], items[5]],
          total: items.length,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          total: items.length,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[4]],
          total: items.length,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );
    });

    it('should apply pagination, sort and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1.2 }),
        new StubEntity({ name: 'c', price: 1.2 }),
        new StubEntity({ name: 'a', price: 1.2 }),
        new StubEntity({ name: 'TEST', price: 1.2 }),
        new StubEntity({ name: 'f', price: 1.2 }),
        new StubEntity({ name: 'teST', price: 1.2 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'test',
          sort: 'name',
          sortDir: 'asc',
        }),
      );

      expect(params).toBeInstanceOf(SearchResult);

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[5]],
          total: 3,
          filter: 'test',
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          currentPage: 1,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'test',
          sort: 'name',
          sortDir: 'asc',
        }),
      );

      expect(params).toBeInstanceOf(SearchResult);

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0]],
          total: 3,
          filter: 'test',
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          currentPage: 2,
        }),
      );
    });
  });
});
