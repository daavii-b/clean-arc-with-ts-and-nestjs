import { ApiProperty } from '@nestjs/swagger';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignUpDto implements SignUpUseCase.ISignUpInput {
  @ApiProperty({ description: 'User name', required: true, maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'User email', required: true, maxLength: 255 })
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
