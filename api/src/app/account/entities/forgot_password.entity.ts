import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID, validate } from "class-validator";
import { v4 } from "uuid";
import { ForgotPasswordToken as ForgotPasswordTokenModel } from "@prisma/client";

import { User, UserModel } from "~/app/user/entities/user.entity";
import ms from "ms";

const tokenTTL = ms("1d");

type Relations = {
  user: UserModel;
};

@ObjectType()
export class ForgotPasswordToken implements ForgotPasswordTokenModel {
  constructor({ user, ...entity }: ForgotPasswordTokenModel & Relations) {
    Object.assign(this, entity);
    this.user = new User(user);
  }

  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => String!)
  @IsUUID()
  userId: string;

  @Field()
  expiresAt: Date;

  readonly createdAt: Date;
}

export async function createForgotPassword(forgotPasswordToken: { user: User } & Partial<ForgotPasswordTokenModel>) {
  const e = new ForgotPasswordToken({
    id: v4(),
    expiresAt: new Date(Date.now() + tokenTTL),
    createdAt: new Date(),
    userId: forgotPasswordToken.user.id,
    ...forgotPasswordToken,
  });
  await validate(e);
  return e;
}
