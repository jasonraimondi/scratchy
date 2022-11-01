import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export abstract class PasswordInput {
  @Length(8)
  @IsString()
  password?: string;
}

@InputType()
export class RegisterInput extends PasswordInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  declare password?: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field()
  @IsEmail()
  email!: string;
}
