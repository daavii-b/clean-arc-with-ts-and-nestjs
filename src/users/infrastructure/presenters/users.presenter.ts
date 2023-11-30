import { CollectionPresenter } from '@shared/infrastructure/presenters/collection.presenter';
import { IUserOutputDTO } from '@users/application/dtos/user-output';
import { ListUsersUseCase } from '@users/application/usecases/list-users.usecase';
import { Transform } from 'class-transformer';

export class UserPresenter {
  id: string;
  name: string;
  email: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: IUserOutputDTO) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUsersUseCase.IListUsersOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);

    this.data = items.map((item) => new UserPresenter(item));
  }
}
