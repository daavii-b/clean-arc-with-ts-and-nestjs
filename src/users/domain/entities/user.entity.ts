import { BaseEntity } from '@shared/domain/entities/entity';
import { EntityValidatorError } from '@shared/domain/errors/validation-error';
import { UserValidatorFactory } from './validator/user.validator';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export interface IUserEntity {
  updateName: (value: string) => void;
  updateEmail: (value: string) => void;
  updatePassword: (value: string) => void;
}

export class UserEntity extends BaseEntity<UserProps> implements IUserEntity {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate({ props });
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  updateName(value: string): void {
    UserEntity.validate({ props: { ...this.props, name: value } });
    this.name = value;
  }

  updateEmail(value: string): void {
    UserEntity.validate({ props: { ...this.props, email: value } });
    this.email = value;
  }

  updatePassword(value: string): void {
    UserEntity.validate({ props: { ...this.props, password: value } });
    this.password = value;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  get password(): string {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static validate({ props }: { props: UserProps }): void {
    const validator = UserValidatorFactory.create();

    const isValid = validator.validate(props);

    if (!isValid) throw new EntityValidatorError(validator.errors);
  }
}
