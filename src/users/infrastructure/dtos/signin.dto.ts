import { SignInUseCase } from '@users/application/usecases/signin.usecase';

export class signUpDto implements SignInUseCase.ISignInInput {
  email: string;
  password: string;
}
