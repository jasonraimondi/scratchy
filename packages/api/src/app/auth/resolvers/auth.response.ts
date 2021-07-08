import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "~/entities/user.entity";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken!: string;

  @Field(() => User!)
  user!: User;

  @Field()
  accessTokenExpiresAt!: number;

  @Field({ nullable: true })
  refreshTokenExpiresAt?: number;
}
