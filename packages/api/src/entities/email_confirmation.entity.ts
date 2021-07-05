import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID, validate } from "class-validator";
import { v4 } from "uuid";
import { EmailConfirmationToken as EmailConfirmationTokenModel } from "@prisma/client";

import { User, UserModel } from "~/entities/user.entity";
import { ENV } from "~/config/environments";

export { EmailConfirmationTokenModel };

type Relations = {
  user: UserModel;
};

@ObjectType()
export class EmailConfirmationToken implements EmailConfirmationTokenModel {
  @Field(() => ID!)
  id: string;

  @Field(() => User!)
  user: User;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  expiresAt: Date;

  createdAt: Date;

  constructor({ user, ...entity }: EmailConfirmationTokenModel & Relations) {
    this.id = entity.id;
    this.expiresAt = entity.expiresAt;
    this.createdAt = entity.createdAt;
    this.userId = entity.userId;
    this.user = new User(user);
  }
}

export type ICreateEmailConfirmation = {
  user: User;
  id?: string;
};

export async function createEmailConfirmation({ user, id }: ICreateEmailConfirmation) {
  const e = new EmailConfirmationToken({
    id: id ?? v4(),
    expiresAt: new Date(Date.now() + ENV.tokenTTLs.emailConfirmationToken),
    createdAt: new Date(),
    userId: user.id,
    user,
  });
  await validate(e);
  return e;
}
