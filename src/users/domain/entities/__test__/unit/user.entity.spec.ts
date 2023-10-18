import { UserEntity, UserProps } from '@domain/entities/user.entity';
import { faker } from '@faker-js/faker';

describe('UserEntity Unit Test', () => {
  let sut: UserEntity;
  let userProps: UserProps;

  beforeEach(() => {
    userProps = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    sut = new UserEntity(userProps);
  });
  it('Constructor', () => {
    expect(sut.props.name).toBe(userProps.name);
    expect(sut.props.email).toBe(userProps.email);
    expect(sut.props.password).toBe(userProps.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });
});
