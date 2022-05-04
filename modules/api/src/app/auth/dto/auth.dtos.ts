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

  @Field({ nullable: true })
  rememberMe?: boolean;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken!: string;

  @Field(() => User!)
  user!: User;

  @Field()
  accessTokenExpiresAt!: Date;

  @Field({ nullable: true })
  refreshTokenExpiresAt?: Date;
}
