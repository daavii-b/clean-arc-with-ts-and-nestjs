import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { PrismaService } from '@shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { UsersModelMapper } from '../models/users-model.mapper';

export class UserPrismaRepository implements NUserRepository.IRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async search(
    props: NUserRepository.SearchParams,
  ): Promise<NUserRepository.SearchResult> {
    const sortable = this.sortableFields.includes(props.sort);
    const sortBy = sortable ? props.sort : 'createdAt';
    const sortDir = sortable ? props.sortDir : 'desc';

    const usersCount = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [sortBy]: sortDir,
      },
      skip:
        props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new NUserRepository.SearchResult({
      items: models.map((model) => UsersModelMapper.toEntity(model)),
      currentPage: props.page,
      filter: props.filter,
      perPage: props.perPage,
      sort: sortBy,
      sortDir,
      total: usersCount,
    });
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany({});

    return models.map((model) => UsersModelMapper.toEntity(model));
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const _id = `${id}`;
      const user = await this.prismaService.user.findUnique({
        where: {
          id: _id,
        },
      });

      return UsersModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`User: ${id} not found `);
    }
  }
}
