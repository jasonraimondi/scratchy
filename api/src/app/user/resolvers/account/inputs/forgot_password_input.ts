import { IsEmail } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { PasswordInput } from "~/app/user/resolvers/account/inputs/register.input";

@InputType()
export class UpdatePasswordInput extends PasswordInput {
  @Field()
  userId: string;

  @Field()
  previousPassword: string;

  @Field()
  password: string;
}

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
  password: string;

  @Field()
  token: string;

  @Field()
  @IsEmail()
  email: string;
}
