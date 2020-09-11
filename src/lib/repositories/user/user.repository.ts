import { PagingResult } from "typeorm-cursor-pagination";

import { User } from "~/entity/user/user.entity";
import { BaseRepository, IBaseRepo } from "~/lib/repositories/base.repository";
import { PagingQuery } from "~/lib/repositories/dtos/paginator.inputs";

export interface IUserRepository extends IBaseRepo<User> {
  list(pagingQuery?: PagingQuery): Promise<PagingResult<User>>;
  findByEmail(email: string): Promise<User>;
  incrementLastLogin(user: User, ipAddr: string): Promise<void>;
  incrementToken(id: string): Promise<void>;
}

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  async list(pagingQuery: PagingQuery = {}) {
    const queryBuilder = this.qb.leftJoinAndSelect("users.roles", "roles");
    return this.paginate(queryBuilder, {
      entity: User,
      alias: "users",
      query: {
        limit: 25,
        order: "DESC",
        ...pagingQuery,
      },
    });
  }

  findByEmail(email: string) {
    email = email.toLowerCase();
    return this.findOneBy({ email });
  }

  async incrementLastLogin(user: User, ipAddr: string) {
    user.lastLoginAt = new Date();
    user.lastLoginIP = ipAddr;
    await this.save(user);
  }

  async incrementToken(userId: string) {
    await this.repository.increment({ id: userId }, "tokenVersion", 1);
  }

  private get qb() {
    return this.repository.createQueryBuilder("users");
  }
}
