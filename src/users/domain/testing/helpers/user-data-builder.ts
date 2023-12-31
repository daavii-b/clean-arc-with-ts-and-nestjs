import { faker } from '@faker-js/faker';
import { UserProps } from '@users/domain/entities/user.entity';
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
        length: 12,
        memorable: false,
        prefix: '!BAra019',
      }),
    createdAt: props.createdAt ?? new Date(),
  };
};
