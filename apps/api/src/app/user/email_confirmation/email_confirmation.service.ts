import { Injectable } from "@nestjs/common";

import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";

@Injectable()
export class EmailConfirmationService {
  constructor(
    private userRepository: UserRepository,
    private emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async verifyEmailConfirmation(email: string, id: string): Promise<void> {
    const userConfirmation = await this.emailConfirmationRepository.findById(id);
    if (userConfirmation.user?.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error(`invalid user and confirmation (${userConfirmation.user!.email}) (${email})`);
    }
    let { user } = userConfirmation;
    if (!user) throw new Error(`must include user`);
    user.isEmailConfirmed = true;
    await this.userRepository.update(user);
    await this.emailConfirmationRepository.delete(userConfirmation.id);
  }
}
