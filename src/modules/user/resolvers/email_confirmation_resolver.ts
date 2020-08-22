import { inject, injectable } from "inversify";
import { Arg, Mutation, Resolver } from "type-graphql";

import { IEmailConfirmationRepository } from "~/lib/repository/user/email_confirmation_repository";
import { REPOSITORY } from "~/lib/constants/inversify";
import { IUserRepository } from "~/lib/repository/user/user_repository";
import { VerifyEmailInput } from "~/modules/user/auth/verify_email_input";

@injectable()
@Resolver()
export class EmailConfirmationResolver {
  constructor(
    @inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    @inject(REPOSITORY.EmailConfirmationRepository)
    private userConfirmationRepository: IEmailConfirmationRepository,
  ) {}

  @Mutation(() => Boolean!)
  async verifyEmailConfirmation(
    @Arg("data") { id, email }: VerifyEmailInput,
  ): Promise<boolean> {
    email = email.toLowerCase();
    const userConfirmation = await this.userConfirmationRepository.findById(
      id,
    );
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
