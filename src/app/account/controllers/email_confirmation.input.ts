import { IsEmail, IsUUID } from "class-validator";

export class EmailConfirmationInput {
  @IsEmail()
  e: string;

  @IsUUID()
  u: string;
}
