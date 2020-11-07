import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "~/app/user/entities/user.entity";
import { BaseRepo } from "~/lib/database/base.repository";
import { PagingQuery } from "~/lib/database/dtos/paginator.inputs";

@Injectable()
export class UserRepo extends BaseRepo<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }

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
