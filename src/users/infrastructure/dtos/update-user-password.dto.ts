import { UpdateUserPasswordUseCase } from '@users/application/usecases/update-user-password.usecase';
export class UpdateUserPasswordDto
  implements Omit<UpdateUserPasswordUseCase.IUpdateUserPasswordInput, 'id'>
{
  password: string;
  oldPassword: string;
}
