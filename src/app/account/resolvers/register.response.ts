import { Field, ObjectType } from "@nestjs/graphql";

import { User } from "~/app/user/entities/user.entity";

@ObjectType()
export class RegisterResponse {
  @Field(() => User)
  user: User;
}
