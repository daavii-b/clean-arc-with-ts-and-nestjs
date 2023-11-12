import { BaseEntity } from '@shared/domain/entities/entity';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { InMemoryRepository } from '@shared/repositories/in-memory-repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends BaseEntity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit test', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'Testing', price: 233 });

    await sut.insert(entity);

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });
  it('should throw an error if entity not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should find a entity by id', async () => {
    const entity = new StubEntity({ name: 'Testing', price: 233 });

    await sut.insert(entity);

    const result = await sut.findById(entity.id);

    expect(entity.toJSON()).toStrictEqual(result.toJSON());
  });
});
