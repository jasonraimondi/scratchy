import { Injectable } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { VerifyEmailInput } from "~/app/user/email_confirmation/email_confirmation.input";

@Injectable()
@Resolver()
export class EmailConfirmationResolver {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Mutation(() => Boolean!)
  async verifyEmailConfirmation(@Args("input") { uuid, email }: VerifyEmailInput): Promise<boolean> {
    return this.emailConfirmationService.verifyEmailConfirmation(email, uuid);
  }
}
