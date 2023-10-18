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

  it('Getter of name field', () => {
    expect(sut.props.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(userProps.name);
  });
  it('Getter of password field', () => {
    expect(sut.props.password).toBeDefined();
    expect(typeof sut.password).toBe('string');
    expect(sut.password).toBe(userProps.password);
  });
  it('Getter of email field', () => {
    expect(sut.props.email).toBeDefined();
    expect(typeof sut.email).toBe('string');
    expect(sut.email).toBe(userProps.email);
  });
  it('Getter of createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(userProps.createdAt);
  });
});
