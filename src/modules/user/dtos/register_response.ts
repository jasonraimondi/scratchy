import { Field, ObjectType } from "type-graphql";

import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => EmailConfirmationToken, { nullable: true })
  emailConfirmation?: EmailConfirmationToken;
}
