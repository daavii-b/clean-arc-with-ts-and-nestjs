import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';

export class UpdateUserDto
  implements Omit<UpdateUserUseCase.IUpdateUserInput, 'id'>
{
  name: string;
}
