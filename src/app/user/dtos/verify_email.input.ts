import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  // @IsUUID("4")
  id: string;
}
