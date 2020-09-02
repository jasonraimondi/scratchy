import { User } from "../../../entity/user/user.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}
