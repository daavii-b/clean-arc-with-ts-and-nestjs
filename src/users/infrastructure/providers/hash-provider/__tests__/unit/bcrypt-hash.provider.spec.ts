import { BcryptHashProvider } from '../../bcrypt-hash.provider';

describe('BcryptHash Provider unit test', () => {
  let sut: BcryptHashProvider;

  beforeEach(() => {
    sut = new BcryptHashProvider();
  });

  it('should return encrypted password', async () => {
    const password = 'myPass3453//';

    const hash = await sut.generateHash(password);

    expect(hash).toBeDefined();
  });

  it('should return false on invalid password hash comparison', async () => {
    const password = 'myPass3453//';

    const hash = await sut.generateHash(password);

    const result = await sut.compareHash('invalidFakePass', hash);

    expect(result).toBeFalsy();
  });

  it('should return true on valid password hash comparison', async () => {
    const password = 'myPass3453//';

    const hash = await sut.generateHash(password);

    const result = await sut.compareHash(password, hash);

    expect(result).toBeTruthy();
  });
});
