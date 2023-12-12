import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto
  implements Omit<UpdateUserUseCase.IUpdateUserInput, 'id'>
{
  @ApiProperty({
    description: 'New user name',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
