import { IsEmail } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { PasswordInput } from "~/app/account/resolvers/register.input";

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
export class UpdatePasswordInput extends PasswordInput {
  @Field()
  password: string;

  @Field()
  token: string;

  @Field()
  @IsEmail()
  email: string;
}
