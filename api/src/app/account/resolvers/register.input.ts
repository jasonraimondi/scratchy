import { IsEmail } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

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

  @Field({ nullable: true })
  password?: string;
}
