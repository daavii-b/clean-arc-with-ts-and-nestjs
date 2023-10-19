import { UserProps } from '@domain/entities/user.entity';
import { UserEntity } from '@domain/entities/UserEntity';
import { userDataBuilder } from '@domain/testing/helpers/user-data-builder';

describe('UserEntity Unit Test', () => {
  let sut: UserEntity;
  let userProps: UserProps;

  beforeEach(() => {
    userProps = userDataBuilder({});

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

  it('Setter of name field', () => {
    const otherName = 'otherName';
    sut['name'] = otherName;
    expect(sut.name).toBe(otherName);
  });
  it('Setter of password field', () => {
    const otherPass = 'otherPass';
    sut['password'] = otherPass;
    expect(sut.password).toBe(otherPass);
  });
  it('Setter of email field', () => {
    const otherEmail = 'otherEmail';
    sut['email'] = otherEmail;
    expect(sut.email).toBe(otherEmail);
  });

  it('should update the name field', () => {
    const newUserName = 'New User Name';
    sut.updateName(newUserName);
    expect(sut.name).toBe(newUserName);
  });
  it('should update the password field', () => {
    const newUserPassword = 'newSome@password';
    sut.updatePassword(newUserPassword);
    expect(sut.password).toBe(newUserPassword);
  });
  it('should update the email field', () => {
    const newUserEmail = 'newemail@email.com';
    sut.updateEmail(newUserEmail);
    expect(sut.email).toBe(newUserEmail);
  });
});
