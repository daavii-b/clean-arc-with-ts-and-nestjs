import { BaseEntity } from '@shared/domain/entities/entity';
import { validate as validateUUID4 } from 'uuid';

type StubProps = {
  prop1: string;
  prop2: string;
  prop3: number;
};
class StubEntity extends BaseEntity<StubProps> {}

describe('Base Entity Unit Tests', () => {
  it('should set properties and ID', () => {
    const props: StubProps = {
      prop1: 'prop1',
      prop2: 'prop2',
      prop3: 3,
    };

    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity.id).not.toBeNull();
    expect(validateUUID4(entity.id)).toBeTruthy();
  });

  it('should accept a valid uuid', () => {
    const uuid4: string = '3888c821-ff8a-4917-a8a8-974f73afebae';
    const props: StubProps = {
      prop1: 'prop1',
      prop2: 'prop2',
      prop3: 3,
    };

    const entity = new StubEntity(props, uuid4);

    expect(validateUUID4(entity.id)).toBeTruthy();
    expect(entity.id).toBe(uuid4);
  });

  it('should return an JSON representation of the entity', () => {
    const uuid4: string = '3888c821-ff8a-4917-a8a8-974f73afebae';
    const props: StubProps = {
      prop1: 'prop1',
      prop2: 'prop2',
      prop3: 3,
    };

    const entity = new StubEntity(props, uuid4);

    expect(entity.toJSON()).toStrictEqual({
      id: uuid4,
      ...props,
    });
  });
});
