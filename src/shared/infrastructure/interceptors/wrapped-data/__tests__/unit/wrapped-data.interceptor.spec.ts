import { of } from 'rxjs';
import { WrappedDataInterceptor } from '../../wrapped-data.interceptor';

describe('WrappedDataInterceptor Unit Tests', () => {
  let interceptor: WrappedDataInterceptor;
  let props: any;

  beforeEach(() => {
    interceptor = new WrappedDataInterceptor();
    props = {
      name: 'foo',
      email: 'foo@example.com',
      password: 'str0NG//2',
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrapper with data key', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });

    obs$.subscribe({
      next: (value) => {
        expect(value).toStrictEqual({
          data: props,
        });
      },
    });
  });
});
