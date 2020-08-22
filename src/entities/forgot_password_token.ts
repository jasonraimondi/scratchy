import { v4 } from "uuid";
import { Field, ObjectType } from "type-graphql";

import { ForgotPasswordTokens, ForgotPasswordTokensFields } from "~db/index";
import { User } from "~/entities/user";

@ObjectType()
export class ForgotPasswordToken implements ForgotPasswordTokens {
  private readonly oneDay = 60 * 60 * 24 * 1 * 1000;

  readonly token: ForgotPasswordTokensFields.token;

  readonly userId: ForgotPasswordTokensFields.userId;

  @Field(() => User)
  readonly user: User;

  @Field()
  readonly expiresAt: ForgotPasswordTokensFields.expiresAt;

  constructor(user: User) {
    this.user = user;
    this.userId = user.id;
    this.token = v4();
    this.expiresAt = new Date(Date.now() + this.oneDay);
  }
}
