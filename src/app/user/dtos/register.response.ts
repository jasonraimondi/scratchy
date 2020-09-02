import { Field, ObjectType } from "type-graphql";

import { User } from "~/entity/user/user.entity";

@ObjectType()
export class RegisterResponse {
  @Field(() => User)
  user: User;
}
