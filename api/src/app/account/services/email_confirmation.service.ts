import { Injectable } from "@nestjs/common";

import { LoggerService } from "~/lib/logger/logger.service";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";

@Injectable()
export class EmailConfirmationService {
  constructor(
    private userRepository: UserRepository,
    private emailConfirmationRepository: EmailConfirmationRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async verifyEmailConfirmation(email: string, id: string): Promise<boolean> {
    email = email.toLowerCase();
    const userConfirmation = await this.emailConfirmationRepository.findById(id);
    if (userConfirmation.user.email !== email) {
      throw new Error(`invalid user and confirmation (${userConfirmation.user.email}) (${email})`);
    }
    try {
      const { user } = userConfirmation;
      user.isEmailConfirmed = true;
      await this.userRepository.create(user);
      await this.emailConfirmationRepository.delete(userConfirmation.id);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }
}
