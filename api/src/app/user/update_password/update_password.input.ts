import { Field, InputType } from "@nestjs/graphql";
import { PasswordInput } from "~/app/user/register/register.input";

@InputType()
export class UpdatePasswordInput extends PasswordInput {
  @Field()
  userId: string;

  @Field()
  currentPassword: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  revokeToken: boolean;
}
