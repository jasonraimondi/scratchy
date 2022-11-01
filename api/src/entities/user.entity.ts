import { Field, ObjectType } from "@nestjs/graphql";
import { BaseUser, UserConstructor, PrismaUser } from "~/generated/entities";
import { validate } from "class-validator";

import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import { hashPassword, verifyPassword } from "~/lib/utils/password";

export type ICreateUser = Omit<UserConstructor, "passwordHash"> & { password?: string };

@ObjectType()
export class User extends BaseUser {
  static async create({ password, ...createUser }: ICreateUser): Promise<User> {
    const passwordHash = password ? await hashPassword(password) : null;
    const user = new User({ ...createUser, passwordHash });
    if (password) await user.setPassword(password);
    await validate(user);
    return user;
  }

  static fromPrisma(prisma: PrismaUser) {
    return new User(prisma);
  }

  @Field(() => Boolean!)
  get isAdmin(): boolean {
    return this.rolesList.includes("overlord");
  }

  @Field(() => Boolean!)
  get isActive(): boolean {
    return this.isEmailConfirmed;
  }

  @Field(() => String, { nullable: true })
  get name(): string | null {
    return this.nickname || this.email;
  }

  @Field(() => [String!]!)
  get permissionsList(): string[] {
    return this.permissions?.filter(r => r.permission?.name).map(r => r.permission!.name) ?? [];
  }

  @Field(() => [String!]!)
  get rolesList(): string[] {
    return this.roles?.filter(r => r.role?.name).map(r => r.role!.name) ?? [];
  }

  async setPassword(password: string) {
    this.passwordHash = await hashPassword(password);
  }

  async verify(password: string) {
    if (!this.passwordHash && (this.providers?.length ?? 0 > 0)) {
      throw UnauthorizedException.invalidUser("user must login with google or reset password");
    }

    if (!this.passwordHash) {
      throw UnauthorizedException.invalidUser("user must create password");
    }

    if (!this.isActive) {
      throw UnauthorizedException.invalidUser("user is not active");
    }

    if (!(await verifyPassword(password, this.passwordHash))) {
      throw UnauthorizedException.invalidUser("invalid password");
    }
  }
}
