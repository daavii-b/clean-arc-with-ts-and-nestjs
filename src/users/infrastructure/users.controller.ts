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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { IUserOutputDTO } from '@users/application/dtos/user-output';
import { DeleteUserUseCase } from '@users/application/usecases/delete-user.usecase';
import { GetUserUseCase } from '@users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { SignInUseCase } from '@users/application/usecases/signin.usecase';
import { SignUpUseCase } from '@users/application/usecases/signup.usecase';
import { UpdateUserPasswordUseCase } from '@users/application/usecases/update-user-password.usecase';
import { UpdateUserUseCase } from '@users/application/usecases/update-user.usecase';
import { AuthGuard } from 'src/auth/infrastructure/auth.guard';
import { AuthService } from 'src/auth/infrastructure/auth.service';
import { ListUsersDto } from './dtos/list-users.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/users.presenter';

@ApiTags('users')
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

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: IUserOutputDTO) {
    return new UserPresenter(output);
  }

  static listUserToResponse(output: ListUsersUseCase.IListUsersOutput) {
    return new UserCollectionPresenter(output);
  }

  @ApiResponse({
    status: 409,
    description: 'Email conflict error',
  })
  @ApiResponse({
    status: 422,
    description: 'Body request with invalid data',
  })
  @Post()
  async signUp(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto);
    return UsersController.userToResponse(output);
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
        userUid: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Body request with invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Credentials',
  })
  @HttpCode(200)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto);
    return this.authService.generateJwt(output.id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
            total: {
              type: 'number',
            },
          },
        },

        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(UserPresenter),
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);

    return UsersController.listUserToResponse(output);
  }
  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid query parameters',
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid query parameters',
  })
  @UseGuards(AuthGuard)
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
