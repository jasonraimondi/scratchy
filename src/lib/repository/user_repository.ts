import { DatabasePoolConnectionType, sql } from "slonik";
import { User } from "~/entities/user";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): void;
  delete(uuid: string): void;
}

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User>;
  incrementLastLoginAt(user: User): Promise<void>;
  incrementToken(uuid: string): Promise<void>;
}

export class UserRepository {
  constructor(private readonly pool: DatabasePoolConnectionType) {}

  findById(id: string) {}

  async create(user: User) {}

  // findByEmail(email: string) {
  //   email = email.toLowerCase();
  //   return this.findOneOrFail({ where: { email } });
  // }
  //
  // async incrementLastLoginAt(user: User) {
  //   user.lastLoginAt = new Date();
  //   await this.save(user);
  // }
  //
  // async incrementToken(userId: string) {
  //   await this.increment({ uuid: userId }, "tokenVersion", 1);
  // }
}
