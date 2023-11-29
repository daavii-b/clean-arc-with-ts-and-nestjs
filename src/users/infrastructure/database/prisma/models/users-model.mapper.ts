import { User } from '@prisma/client';
import { ValidationError } from '@shared/domain/errors/validation-error';
import { UserEntity } from '@users/domain/entities/user.entity';

export class UsersModelMapper {
  static toEntity(model: User): UserEntity {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    };

    try {
      return new UserEntity(data, model.id);
    } catch (error) {
      throw new ValidationError(
        'An entity cannot be loaded from the database',
      );
    }
  }
}
