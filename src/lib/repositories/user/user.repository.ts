import { EntityRepository, QueryRunner, Repository } from "typeorm";
import { buildPaginator, PagingResult } from "typeorm-cursor-pagination";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";

import { User } from "~/entity/user/user.entity";
import { IBaseRepository } from "~/lib/repositories/base.repository";
import { PagingQuery } from "~/lib/repositories/dtos/paginator.inputs";

export interface IUserRepository extends IBaseRepository<User> {
  list(query?: PagingQuery): Promise<PagingResult<User>>;

  findByEmail(email: string): Promise<User>;

  incrementLastLogin(user: User, ipAddr: string): Promise<void>;

  incrementToken(id: string): Promise<void>;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
  async list(query?: PagingQuery) {
    const queryBuilder = this.qb.leftJoinAndSelect("users.roles", "roles");
    return this.paginate(queryBuilder, query);
  }

  findById(id: string) {
    return this.findOneOrFail(id);
  }

  findByEmail(email: string) {
    email = email.toLowerCase();
    return this.findOneOrFail({ where: { email } });
  }

  async incrementLastLogin(user: User, ipAddr: string) {
    user.lastLoginAt = new Date();
    user.lastLoginIP = ipAddr;
    await this.save(user);
  }

  async incrementToken(userId: string) {
    await this.increment({ id: userId }, "tokenVersion", 1);
  }

  private async paginate(queryBuilder: SelectQueryBuilder<User>, query?: PagingQuery) {
    const paginator = buildPaginator({
      entity: User,
      alias: "users",
      // paginationKeys: ['email', 'createdAt'],
      query: {
        limit: 25,
        order: "DESC",
        ...query,
      },
    });
    return await paginator.paginate(queryBuilder);
  }

  private get qb() {
    return this.createQueryBuilder("users");
  }
}
