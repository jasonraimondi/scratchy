import { Injectable } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { VerifyEmailInput } from "~/app/account/resolvers/auth/verify_email_input";
import { EmailConfirmationService } from "~/app/account/services/email_confirmation.service";

@Injectable()
@Resolver()
export class EmailConfirmationResolver {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Mutation(() => Boolean!)
  async verifyEmailConfirmation(@Args("data") { uuid, email }: VerifyEmailInput): Promise<boolean> {
    return this.emailConfirmationService.verifyEmailConfirmation(email, uuid);
  }
}
