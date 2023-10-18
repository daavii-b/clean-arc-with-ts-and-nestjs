import { UserProps } from '@domain/entities/user.entity';
import { faker } from '@faker-js/faker';
export type UserPropsOptionals = {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
};

export const userDataBuilder = (props: UserPropsOptionals): UserProps => {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    createdAt: props.createdAt ?? new Date(),
  };
};
