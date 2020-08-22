import { Field, ID, ObjectType, Root } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";
import { IsEmail, validateOrReject } from "class-validator";

import { Users, UsersFields } from "../../db";

export interface ICreateUser {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  uuid?: string;
  createdIpAddress?: string;
}

export interface ICreateUserExtended extends ICreateUser {
  password?: string;
}

@ObjectType()
export class User implements Users {
  static async create({
    password,
    ...create
  }: ICreateUserExtended): Promise<User> {
    const user = new User(create);
    if (password) await user.setPassword(password);
    await validateOrReject(user);
    return user;
  }

  private constructor({
    uuid = v4(),
    email,
    firstName = null,
    lastName = null,
    createdIpAddress = "0.0.0.0",
  }: ICreateUser) {
    this.id = uuid;
    this.email = email.toLowerCase();
    this.isEmailConfirmed = false;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdIp = createdIpAddress;
    this.createdAt = new Date();
    this.password = null;
    this.lastLoginAt = null;
    this.lastLoginIp = null;
    this.updatedAt = null;
  }

  @Field(() => ID)
  readonly id: UsersFields.id;

  @IsEmail()
  @Field()
  email: UsersFields.email;

  password: UsersFields.password;

  @Field(() => String, { nullable: true })
  firstName: UsersFields.firstName;

  @Field(() => String, { nullable: true })
  lastName: UsersFields.lastName;

  @Field()
  isEmailConfirmed: UsersFields.isEmailConfirmed;

  lastLoginIp: UsersFields.lastLoginIp;

  lastLoginAt: UsersFields.lastLoginAt;

  readonly createdIp: UsersFields.createdIp;

  @Field(() => Date)
  readonly createdAt: UsersFields.createdAt;

  updatedAt: UsersFields.updatedAt;

  get fullName(): string | undefined {
    const name = [];
    if (this.firstName) name.push(this.firstName);
    if (this.lastName) name.push(this.lastName);
    return name.join(" ") || undefined;
  }

  @Field()
  isActive(@Root() user: User): boolean {
    return user.isEmailConfirmed && !!user.password;
  }

  async setPassword(password: string): Promise<void> {
    this.password = await hash(password, 12);
  }

  async checkPassword(password: string): Promise<void> {
    if (!this.password) {
      throw new Error("user must create password");
    }

    const isValid = await compare(password, this.password);

    if (!isValid) {
      throw new Error("invalid password");
    }
  }

  async verify(password: string): Promise<void> {
    if (!this.isActive(this)) {
      throw new Error("user is not active");
    }
  }
}
