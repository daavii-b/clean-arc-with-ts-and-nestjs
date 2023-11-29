import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeleteUserUseCase } from '@users/application/usecases/delete-user.usecase';
import { GetUserUseCase } from '@users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { SignInUseCase } from '@users/application/usecases/signin.usecase';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import { UpdateUserPasswordUseCase } from '@users/application/usecases/update-user-password.usecase';
import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { ListUserDto } from './dtos/list-users.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase.UseCase)
  private signUpUseCase: SignUpUseCase.UseCase;

  @Inject(SignInUseCase.UseCase)
  private signInUseCase: SignInUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(UpdateUserPasswordUseCase.UseCase)
  private updateUserPasswordUseCase: UpdateUserPasswordUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Post()
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.signUpUseCase.execute(signUpDto);
  }

  @HttpCode(200)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.signInUseCase.execute(signInDto);
  }

  @Get()
  async search(@Query() searchParams: ListUserDto) {
    return await this.listUsersUseCase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return await this.updateUserPasswordUseCase.execute({
      id,
      ...updateUserPasswordDto,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
