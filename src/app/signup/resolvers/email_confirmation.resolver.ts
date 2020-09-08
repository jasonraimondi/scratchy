import { Inject, Logger } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { VerifyEmailInput } from "~/app/user/dtos/verify_email.input";
import { REPOSITORY } from "~/lib/config/keys";
import { IEmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class EmailConfirmationResolver {
  private readonly logger = new Logger(EmailConfirmationResolver.name);

  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    @Inject(REPOSITORY.EmailConfirmationRepository) private userConfirmationRepository: IEmailConfirmationRepository,
  ) {}

  @Mutation(() => Boolean!)
  async verifyEmailConfirmation(@Args("data") { id, email }: VerifyEmailInput): Promise<boolean> {
    email = email.toLowerCase();
    const userConfirmation = await this.userConfirmationRepository.findById(id);
    if (userConfirmation.user.email !== email) {
      throw new Error(`invalid user and confirmation (${userConfirmation.user.email}) (${email})`);
    }
    try {
      const { user } = userConfirmation;
      user.isEmailConfirmed = true;
      await this.userRepository.save(user);
      await this.userConfirmationRepository.delete(userConfirmation.id);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }
}
