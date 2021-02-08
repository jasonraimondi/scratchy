import { IsEmail } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  // @IsUUID("4")
  uuid: string;
}
