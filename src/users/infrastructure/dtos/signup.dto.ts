import { SignUpUseCase } from '@users/application/usecases/signup.usecase';

export class signUpDto implements SignUpUseCase.ISignUpInput {
  name: string;
  email: string;
  password: string;
}
