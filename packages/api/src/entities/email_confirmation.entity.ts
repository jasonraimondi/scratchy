import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID, validate } from "class-validator";
import { v4 } from "uuid";

import { User } from "~/entities/user.entity";
import { ENV } from "~/config/environments";

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
  e.expiresAt = new Date(Date.now() + ENV.tokenTTLs.emailConfirmationToken);
  await validate(e);
  return e;
}
