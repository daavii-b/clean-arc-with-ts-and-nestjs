import { UpdateUserPasswordUseCase } from '@users/application/usecases/update-user-password.usecase';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
export class UpdateUserPasswordDto
  implements Omit<UpdateUserPasswordUseCase.IUpdateUserPasswordInput, 'id'>
{
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minNumbers: 2,
    minSymbols: 0,
    minUppercase: 1,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minNumbers: 2,
    minSymbols: 0,
    minUppercase: 1,
  })
  oldPassword: string;
}
