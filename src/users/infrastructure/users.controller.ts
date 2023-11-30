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
import { IUserOutputDTO } from '@users/application/dtos/user-output';
import { DeleteUserUseCase } from '@users/application/usecases/delete-user.usecase';
import { GetUserUseCase } from '@users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { SignInUseCase } from '@users/application/usecases/signin.usecase';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import { UpdateUserPasswordUseCase } from '@users/application/usecases/update-user-password.usecase';
import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { ListUsersDto } from './dtos/list-users.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/users.presenter';

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

  static userToResponse(output: IUserOutputDTO) {
    return new UserPresenter(output);
  }

  static listUserToResponse(output: ListUsersUseCase.IListUsersOutput) {
    return new UserCollectionPresenter(output);
  }

  @Post()
  async signUp(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto);
    return UsersController.userToResponse(output);
  }

  @HttpCode(200)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto);
    return UsersController.userToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);

    return UsersController.listUserToResponse(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const output = await this.updateUserPasswordUseCase.execute({
      id,
      ...updateUserPasswordDto,
    });
    return UsersController.userToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
