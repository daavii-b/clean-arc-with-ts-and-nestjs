import { BaseEntity } from '@shared/domain/entities/entity';
import { InMemorySearchableRepository } from '@shared/repositories/in-memory-searchable.repository';

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
  describe('applyPagination method', () => {});
  describe('search method', () => {});
});
