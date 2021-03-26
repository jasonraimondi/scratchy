import { Field, ID, ObjectType } from "@nestjs/graphql";
import { compare, hash } from "bcryptjs";
import { IsEmail, IsIP, validate } from "class-validator";
import { v4 } from "uuid";

// import { Permission } from "~/app/user/entities/permission.entity";
// import { Role } from "~/app/user/entities/role.entity";
import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { ENV } from "~/config/environments";
import { Role } from "~/app/user/entities/role.entity";
import { Permission } from "~/app/user/entities/permission.entity";

export interface ICreateUser {
  email: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  createdIP?: string;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @IsEmail()
  email: string;

  passwordHash?: string | null;

  @Field(() => String, { nullable: true })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  lastName?: string | null;

  @Field()
  isEmailConfirmed: boolean;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date | null;

  @IsIP()
  lastLoginIP?: string | null;

  @IsIP()
  createdIP?: string | null;

  createdAt: Date;

  updatedAt?: Date | null;

  tokenVersion: number;

  oauthGoogleIdentifier?: string | null;

  oauthGithubIdentifier?: string | null;

  // @Field(() => [Role], { nullable: "itemsAndList", defaultValue: [] })
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
    this.passwordHash = await hash(password, 12);
  }

  get jwtPayload() {
    return {
      id: this.id,
      email: this.email,
      isActive: this.isActive,
    };
  }
}

export async function createUser({ id, email, firstName, lastName, password, createdIP }: ICreateUser): Promise<User> {
  const user = new User();
  user.id = id ?? v4();
  user.email = email?.toLowerCase();
  user.firstName = firstName;
  user.lastName = lastName;
  user.createdIP = createdIP;
  if (password) user.passwordHash = await setPassword(password);
  await validate(user);
  return user;
}

export function setPassword(password: string) {
  return hash(password + ENV.salt, 12);
}

export async function verifyPassword(user: User, password: string) {
  if (!user.passwordHash && user.oauthGoogleIdentifier) {
    throw UnauthorizedException.invalidUser("user must login with google or reset password");
  }

  if (!user.passwordHash) {
    throw UnauthorizedException.invalidUser("user must create password");
  }

  const isActive = user.isEmailConfirmed;

  if (!isActive) {
    throw UnauthorizedException.invalidUser("user is not active");
  }

  if (!(await compare(password, user.passwordHash + ENV.salt))) {
    throw UnauthorizedException.invalidUser("invalid password");
  }
}
