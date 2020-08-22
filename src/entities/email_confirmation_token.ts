import { v4 } from "uuid";
import { Field, ObjectType } from "type-graphql";

import {
  EmailConfirmationTokens,
  EmailConfirmationTokensFields,
} from "~db/index";
import { User } from "~/entities/user";

@ObjectType()
export class EmailConfirmationToken implements EmailConfirmationTokens {
  private readonly sevenDays = 60 * 60 * 24 * 7 * 1000;

  @Field(() => String)
  readonly token: EmailConfirmationTokensFields.token;

  readonly userId: EmailConfirmationTokensFields.userId;

  @Field(() => User)
  readonly user: User;

  @Field()
  readonly expiresAt: EmailConfirmationTokensFields.expiresAt;

  constructor(user: User) {
    this.user = user;
    this.userId = user.id;
    this.token = v4();
    this.expiresAt = new Date(Date.now() + this.sevenDays);
  }
}
