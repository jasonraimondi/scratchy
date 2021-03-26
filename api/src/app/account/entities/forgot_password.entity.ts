import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsDate, IsUUID, validate } from "class-validator";
import { v4 } from "uuid";

import { User } from "~/app/user/entities/user.entity";
import ms from "ms";

const tokenTTL = ms("1d");

@ObjectType()
export class ForgotPasswordToken {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  expiresAt: Date;
}

export async function createForgotPassword({ user, id }: { user: User; id?: string }) {
  const e = new ForgotPasswordToken();
  e.id = id ?? v4();
  e.user = user;
  e.userId = user.id;
  e.expiresAt = new Date(Date.now() + tokenTTL);
  await validate(e);
  return e;
}
