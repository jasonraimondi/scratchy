import { Field, ObjectType } from "@nestjs/graphql";

import { User } from "~/entity/user/user.entity";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}
