import { Field, InputType } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class RegisterInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
