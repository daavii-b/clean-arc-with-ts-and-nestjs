import { ApiProperty } from '@nestjs/swagger';
import { SignInUseCase } from '@users/application/usecases/signin.usecase';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignInDto implements SignInUseCase.ISignInInput {
  @ApiProperty({
    description: 'User email address',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
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
}
