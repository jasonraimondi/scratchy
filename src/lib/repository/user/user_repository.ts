import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "~/lib/repository/base_repository";
import { User } from "~/entity/user/user_entity";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User>;
  incrementLastLoginAt(user: User): Promise<void>;
  incrementToken(uuid: string): Promise<void>;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
  findById(uuid: string) {
    return this.findOneOrFail(uuid);
  }

  findByEmail(email: string) {
    email = email.toLowerCase();
    return this.findOneOrFail({ where: { email } });
  }

  async incrementLastLoginAt(user: User) {
    user.lastLoginAt = new Date();
    await this.save(user);
  }

  async incrementToken(userId: string) {
    await this.increment({ uuid: userId }, "tokenVersion", 1);
  }
}
