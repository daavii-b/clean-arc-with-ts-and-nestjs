import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'New user password',
    required: true,
    maxLength: 255,
    additionalProperties: {
      minLength: 8,
    },
  })
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

  @ApiProperty({
    description: 'Old user password',
    required: true,
    maxLength: 255,
    additionalProperties: {
      minLength: 8,
    },
  })
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
