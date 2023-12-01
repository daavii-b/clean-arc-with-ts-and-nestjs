import { ConflictError } from '@shared/domain/errors/conflict-error';
import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { PrismaService } from '@shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { UsersModelMapper } from '../models/users-model.mapper';

export class UserPrismaRepository implements NUserRepository.IRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      return UsersModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`User: ${email} not found`);
    }
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new ConflictError('Email already exists');
    }
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

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity.id);

    await this.prismaService.user.update({
      data: entity.toJSON(),
      where: {
        id: entity.id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this._get(id);

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
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
      throw new NotFoundError(`User: ${id} not found`);
    }
  }
}
