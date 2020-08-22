import { EntityRepository, Repository } from "typeorm";

import { User } from "~/entity/user/user_entity";
import { IBaseRepository } from "~/lib/repositories/base.repository";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User>;

  incrementLastLoginAt(user: User): Promise<void>;

  incrementToken(id: string): Promise<void>;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
  findById(id: string) {
    return this.findOneOrFail(id);
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
    await this.increment({ id: userId }, "tokenVersion", 1);
  }
}
