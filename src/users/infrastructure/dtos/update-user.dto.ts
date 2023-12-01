import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto
  implements Omit<UpdateUserUseCase.IUpdateUserInput, 'id'>
{
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
