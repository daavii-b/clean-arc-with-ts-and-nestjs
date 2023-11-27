import { UserEntity } from '@domain/entities/user.entity';
import { ConflictError } from '@shared/domain/errors/conflict-error';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { UserInMemoryRepository } from '../../user-in-memory.repository';

describe('UserInMemoryRepository unit test', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('should throw error if user not found by email', async () => {
    await expect(
      async () => await sut.findByEmail('test@email.com'),
    ).rejects.toThrow(
      new NotFoundError('User not found using: test@email.com'),
    );
  });

  it('should found an user by email', async () => {
    const user = new UserEntity({
      email: 'test@email.com',
      name: 'Test User',
      password: 'aBBc234//s2',
    });

    await sut.insert(user);
    const result = await sut.findByEmail(user.email);
    expect(result).toBe(user);
    expect(result.toJSON()).toStrictEqual(user.toJSON());
  });

  it('should throw error if email already exists', async () => {
    const user = new UserEntity({
      email: 'test@email.com',
      name: 'Test User',
      password: 'aBBc234//s2',
    });

    await sut.insert(user);

    await expect(
      async () => await sut.emailExists(user.email),
    ).rejects.toThrow(new ConflictError('Email address already exists'));
  });

  it('should not throw error if email not already exists', async () => {
    expect.assertions(0);

    await sut.emailExists('test@emai.com');
  });
});
