import { SignInUseCase } from '@users/application/usecases/signin.usecase';

export class SignInDto implements SignInUseCase.ISignInInput {
  email: string;
  password: string;
}
