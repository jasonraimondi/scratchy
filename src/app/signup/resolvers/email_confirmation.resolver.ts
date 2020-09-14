import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { VerifyEmailInput } from "~/app/user/dtos/verify_email.input";
import { LoggerService } from "~/lib/logger/logger.service";
import { EmailConfirmationRepo } from "~/lib/repositories/user/email_confirmation.repository";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Resolver()
export class EmailConfirmationResolver {
  constructor(
    private userRepository: UserRepo,
    private userConfirmationRepository: EmailConfirmationRepo,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(EmailConfirmationResolver.name);
  }

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
