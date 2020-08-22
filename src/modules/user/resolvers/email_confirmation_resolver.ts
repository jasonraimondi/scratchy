import { Inject } from "@nestjs/common";
import { Arg, Mutation, Resolver } from "type-graphql";

import { REPOSITORY } from "~/lib/constants/inversify";
import { VerifyEmailInput } from "~/modules/user/inputs/verify_email_input";
import { IEmailConfirmationRepository } from "~/lib/repository/user/email_confirmation.repository";
import { IUserRepository } from "~/lib/repository/user/user.repository";

@Resolver()
export class EmailConfirmationResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    @Inject(REPOSITORY.EmailConfirmationRepository)
    private userConfirmationRepository: IEmailConfirmationRepository,
  ) {}

  @Mutation(() => Boolean!)
  async verifyEmailConfirmation(
    @Arg("data") { id, email }: VerifyEmailInput,
  ): Promise<boolean> {
    email = email.toLowerCase();
    const userConfirmation = await this.userConfirmationRepository.findById(id);
    if (userConfirmation.user.email !== email) {
      throw new Error(
        `invalid user and confirmation (${userConfirmation.user.email}) (${email})`,
      );
    }
    try {
      const { user } = userConfirmation;
      user.isEmailConfirmed = true;
      await this.userRepository.save(user);
      await this.userConfirmationRepository.delete(userConfirmation.id);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
