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
    password:
      props.password ??
      faker.internet.password({
        length: 15,
        pattern: /[A-Z{3, }a-z{3, }0-9{3}(/\@#$%*_+=)]/,
      }),
    createdAt: props.createdAt ?? new Date(),
  };
};
