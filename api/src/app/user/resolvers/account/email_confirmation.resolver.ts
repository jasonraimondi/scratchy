import { Injectable } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { VerifyEmailInput } from "~/app/user/resolvers/account/inputs/verify_email_input";
import { EmailConfirmationService } from "~/app/user/services/email_confirmation.service";

@Injectable()
@Resolver()
export class EmailConfirmationResolver {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Mutation(() => Boolean!)
  async verifyEmailConfirmation(@Args("data") { uuid, email }: VerifyEmailInput): Promise<boolean> {
    return this.emailConfirmationService.verifyEmailConfirmation(email, uuid);
  }
}
