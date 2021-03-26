import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID, validate } from "class-validator";
import { v4 } from "uuid";
import ms from "ms";

import { User } from "~/app/user/entities/user.entity";

const tokenTTL = ms("7d");

@ObjectType()
export class EmailConfirmationToken {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  expiresAt: Date;

  createdAt: Date;
}

export async function createEmailConfirmation({ user, id }: { user: User; id?: string }) {
  const e = new EmailConfirmationToken();
  e.id = id ?? v4();
  e.user = user;
  e.userId = user.id;
  e.expiresAt = new Date(Date.now() + tokenTTL);
  await validate(e);
  return e;
}
