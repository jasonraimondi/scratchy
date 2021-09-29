import { IsEmail } from "class-validator";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { User } from "~/entities/user.entity";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;

  @Field()
  rememberMe!: boolean;
}

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
