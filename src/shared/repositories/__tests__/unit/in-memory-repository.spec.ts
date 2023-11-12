import { BaseEntity } from '@shared/domain/entities/entity';
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

  it('should inserts a new register', async () => {
    const entity = new StubEntity({ name: 'Testing', price: 233 });

    await sut.insert(entity);

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });
});
