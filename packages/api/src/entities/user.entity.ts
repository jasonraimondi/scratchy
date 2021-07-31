import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsIP, validate } from "class-validator";
import { User as UserModel } from "@prisma/client";
import { v4 } from "uuid";

import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import { Role, RoleModel } from "~/entities/role.entity";
import { Permission, PermissionModel } from "~/entities/permission.entity";
import { verifyPassword, hashPassword } from "~/lib/utils/password";

export { UserModel };

export type ICreateUser = { email: string; password?: string } & Partial<UserModel>;

type Relations = {
  roles: RoleModel[];
  permissions: PermissionModel[];
};

@ObjectType()
export class User implements UserModel {
  constructor({ roles = [], permissions = [], ...entity }: UserModel & Partial<Relations>) {
    this.id = entity.id;
    this.email = entity.email;
    this.passwordHash = entity.passwordHash;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.isEmailConfirmed = entity.isEmailConfirmed;
    this.lastLoginAt = entity.lastLoginAt;
    this.lastLoginIP = entity.lastLoginIP;
    this.lastHeartbeatAt = entity.lastHeartbeatAt;
    this.createdIP = entity.createdIP;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.tokenVersion = entity.tokenVersion;
    this.oauthGoogleIdentifier = entity.oauthGoogleIdentifier;
    this.oauthGithubIdentifier = entity.oauthGithubIdentifier;
    this.roles = roles.map((r) => new Role(r));
    this.permissions = permissions.map((p) => new Permission(p));
  }

  @Field(() => ID)
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
  @Field(() => Date, { nullable: true })
  lastLoginAt: Date | null;
  @IsIP()
  lastLoginIP: string | null;
  @IsIP()
  readonly createdIP: string;
  readonly createdAt: Date;
  updatedAt: Date | null;
  tokenVersion: number;
  oauthGoogleIdentifier: string | null;
  oauthGithubIdentifier: string | null;
  roles?: Role[] | null;
  permissions?: Permission[] | null;

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
    if (!this.passwordHash && this.oauthGoogleIdentifier) {
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

  static async create({ password, ...createUser }: ICreateUser): Promise<User> {
    const user = new User({
      id: createUser.id ?? v4(),
      email: createUser.email,
      createdAt: createUser.createdAt ?? new Date(),
      isEmailConfirmed: createUser.isEmailConfirmed ?? false,
      createdIP: createUser.createdIP ?? "127.0.0.2",
      tokenVersion: createUser.tokenVersion ?? 1,
      firstName: createUser.firstName ?? null,
      lastName: createUser.lastName ?? null,
      lastHeartbeatAt: createUser.lastLoginAt ?? null,
      lastLoginAt: createUser.lastLoginAt ?? null,
      lastLoginIP: createUser.lastLoginIP ?? null,
      updatedAt: createUser.updatedAt ?? null,
      oauthGoogleIdentifier: createUser.oauthGoogleIdentifier ?? null,
      oauthGithubIdentifier: createUser.oauthGithubIdentifier ?? null,
      passwordHash: createUser.passwordHash ?? null,
    });
    if (password) await user.setPassword(password);
    await validate(user);
    return user;
  }
}
