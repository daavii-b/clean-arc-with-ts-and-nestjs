import { NotFoundError } from '@shared/domain/errors/not-found-error';
import { PrismaService } from '@shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@users/domain/entities/user.entity';
import { NUserRepository } from '@users/domain/repositories/user.repository';
import { UsersModelMapper } from '../models/users-model.mapper';

export class UserPrismaRepository implements NUserRepository.IRepository {
  sortableFields: string[];

  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  search(
    props: NUserRepository.SearchParams,
  ): Promise<NUserRepository.SearchResult> {
    throw new Error('Method not implemented.');
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
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
