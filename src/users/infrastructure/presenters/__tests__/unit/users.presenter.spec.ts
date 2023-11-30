import { UserPresenter } from '../../users.presenter';

describe('UserPresente Unit Tests', () => {
  const props = {
    id: '69638f89-c731-475f-9bfd-cd858693d7d0',
    name: 'Test User',
    email: 'test@example.com',
    password: 'm@Pas234/',
    createdAt: new Date(),
  };
  describe('constructor method', () => {
    it('should set props', () => {
      const sut = new UserPresenter(props);

      expect(sut).toBeDefined();
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toBe(props.createdAt);
    });
  });
});
