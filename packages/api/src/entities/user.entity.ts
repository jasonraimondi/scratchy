import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsIP, validate } from "class-validator";
import { Provider, User as UserModel } from "@prisma/client";
import { v4 } from "uuid";

import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import { Role, RoleModel } from "~/entities/role.entity";
import { Permission, PermissionModel } from "~/entities/permission.entity";
import { hashPassword, verifyPassword } from "~/lib/utils/password";
import { UserProvider } from "~/entities/user_provider.entity";
import { EntityConstructor } from "~/entities/_entity";

export { UserModel };

export type ICreateUser = Pick<UserModel, "email" | "createdIP"> &
  Omit<Partial<UserModel>, "passwordHash"> & { password?: string };

type Relations = {
  roles?: RoleModel[];
  permissions?: PermissionModel[];
  providers?: UserProvider[];
};

@ObjectType()
export class User implements UserModel {
  @Field(() => ID!)
  readonly id: string;

  @Field()
  @IsEmail()
  readonly email: string;

  passwordHash: string | null;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field()
  isEmailConfirmed: boolean;

  @Field(() => Date, { nullable: true })
  lastHeartbeatAt: Date | null;

  lastLoginAt: Date | null;

  @IsIP()
  lastLoginIP: string | null;

  @IsIP()
  readonly createdIP: string;

  @Field(() => Date!)
  readonly createdAt = new Date();

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;
  tokenVersion: number;

  roles?: Role[];
  permissions?: Permission[];
  providers?: UserProvider[];

  constructor(u: EntityConstructor<UserModel, Relations, "email" | "createdIP">) {
    this.email = u.email;
    this.createdIP = u.createdIP;
    this.id = u.id ?? v4();
    this.passwordHash = u.passwordHash ?? null;
    this.firstName = u.firstName ?? null;
    this.lastName = u.lastName ?? null;
    this.isEmailConfirmed = u.isEmailConfirmed ?? false;
    this.lastLoginAt = u.lastLoginAt ?? null;
    this.lastLoginIP = u.lastLoginIP ?? null;
    this.lastHeartbeatAt = u.lastHeartbeatAt ?? null;
    this.createdAt = u.createdAt ?? new Date();
    this.updatedAt = u.updatedAt ?? null;
    this.tokenVersion = u.tokenVersion ?? 1;
    this.providers = u.providers?.map((p) => new UserProvider(p));
    this.roles = u.roles?.map((r) => new Role(r));
    this.permissions = u.permissions?.map((p) => new Permission(p));
  }

  toEntity(): UserModel {
    const { permissions, providers, roles, ...entity } = this;
    return entity;
  }

  static async create({ password, ...createUser }: ICreateUser): Promise<User> {
    const user = new User(createUser);
    if (password) await user.setPassword(password);
    await validate(user);
    return user;
  }

  @Field(() => Boolean)
  get isActive(): boolean {
    return this.isEmailConfirmed;
  }

  @Field(() => String, { nullable: true })
  get name() {
    const name = [];
    if (this.firstName) name.push(this.firstName);
    if (this.lastName) name.push(this.lastName);
    return name.join(" ") || null;
  }

  async setPassword(password: string) {
    // @todo should guard against things here
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

  getProvider(name: Provider): UserProvider | undefined {
    return this.providers?.filter((p) => p.provider === name)?.[0];
  }
}
