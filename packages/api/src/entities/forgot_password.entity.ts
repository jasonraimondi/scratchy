import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID, validate } from "class-validator";
import { v4 } from "uuid";
import { ForgotPasswordToken as ForgotPasswordTokenModel } from "@prisma/client";

import { User, UserModel } from "~/entities/user.entity";
import { ENV } from "~/config/environments";

type Relations = {
  user: UserModel;
};

export { ForgotPasswordTokenModel };

@ObjectType()
export class ForgotPasswordToken implements ForgotPasswordTokenModel {
  constructor({ user, ...entity }: ForgotPasswordTokenModel & Partial<Relations>) {
    this.id = entity.id;
    this.expiresAt = entity.expiresAt;
    this.createdAt = entity.createdAt;
    this.userId = entity.userId;
    if (user) this.user = new User(user);
  }

  @Field(() => ID)
  id: string;

  @Field(() => User)
  user?: User;

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
    expiresAt: new Date(Date.now() + ENV.tokenTTLs.forgotPasswordToken),
    createdAt: new Date(),
    userId: forgotPasswordToken.user.id,
    ...forgotPasswordToken,
  });
  await validate(e);
  return e;
}
