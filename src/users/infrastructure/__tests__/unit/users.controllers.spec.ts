import { IUserOutputDTO } from '@users/application/dtos/user-output';
import { SignInUseCase } from '@users/application/usecases/signin.usecase';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { UpdateUserDto } from '@users/infra/dtos/update-user.dto';
import { UsersController } from '@users/infra/users.controller';

describe('UsersControllers unit tests', () => {
  let sut: UsersController;
  let id: string;
  let userOutput: IUserOutputDTO;

  beforeEach(() => {
    sut = new UsersController();
    id = '1f754455-8276-42e7-8a96-cc98921fb347';
    userOutput = {
      id,
      name: 'User Test',
      email: 'test@example.com',
      password: '//23FFGtest',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create an user', async () => {
    const output: SignUpUseCase.ISignUpOutput = userOutput;
    const input: SignUpUseCase.ISignUpInput = {
      name: 'User Test',
      email: 'test@example.com',
      password: '//23FFGtest',
    };
    const mockSignUpUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signUpUseCase'] = mockSignUpUseCase as any;

    const result = await sut.signUp(input);

    expect(output).toMatchObject(result);
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate an user', async () => {
    const output: SignInUseCase.ISignInInput = userOutput;
    const input: SignInUseCase.ISignInInput = {
      email: 'test@example.com',
      password: '//23FFGtest',
    };
    const mockSignInUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signInUseCase'] = mockSignInUseCase as any;

    const result = await sut.signIn(input);

    expect(output).toMatchObject(result);
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update an user', async () => {
    const output: UpdateUserUseCase.IUpdateUserOutput = userOutput;
    const input: UpdateUserDto = {
      name: 'Other Test Name',
    };
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;

    const result = await sut.update(id, input);

    expect(output).toMatchObject(result);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });
});
