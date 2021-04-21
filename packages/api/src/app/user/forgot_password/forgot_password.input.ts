import { IsEmail } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { PasswordInput } from "~/app/user/register/register.input";

@InputType()
export class ValidateForgotPasswordTokenInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  token: string;
}

@InputType()
export class SendForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class UpdatePasswordFromTokenInput extends PasswordInput {
  @Field()
  declare password: string;

  @Field()
  token: string;

  @Field()
  @IsEmail()
  email: string;
}
