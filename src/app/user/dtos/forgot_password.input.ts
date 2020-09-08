import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SendForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  @Length(5)
  password: string;

  @Field()
  // @IsUUID("4")
  token: string;

  @Field()
  @IsEmail()
  email: string;
}
