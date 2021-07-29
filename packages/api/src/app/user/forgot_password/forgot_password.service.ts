import { Injectable } from "@nestjs/common";

import { createForgotPassword, ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { User } from "~/entities/user.entity";
import { ForgotPasswordMailer } from "~/lib/email/mailers/forgot_password.mailer";
import { LoggerService } from "~/lib/logger/logger.service";
import { ForgotPasswordRepository } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import {
  UpdatePasswordFromTokenInput,
  ValidateForgotPasswordTokenInput,
} from "~/app/user/forgot_password/forgot_password.input";

@Injectable()
export class ForgotPasswordService {
  constructor(
    private userRepository: UserRepository,
    private forgotPasswordRepository: ForgotPasswordRepository,
    private forgotPasswordEmail: ForgotPasswordMailer,
    private logger: LoggerService,
  ) {}

  async validateForgotPasswordToken({ email, token }: ValidateForgotPasswordTokenInput) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    this.logger.debug("validateForgotPasswordToken");
    if (forgotPassword?.user?.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error("invalid emails or token");
    }
    this.logger.debug("validateForgotPasswordToken");
    return true;
  }

  async sendForgotPasswordEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    const forgotPassword = await this.getForgotPasswordForUser(user);
    try {
      await this.forgotPasswordEmail.send(forgotPassword);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }

  async updatePasswordFromToken({ email, token, password }: UpdatePasswordFromTokenInput): Promise<User> {
    const { user, ...forgotPassword } = await this.forgotPasswordRepository.findById(token);
    if (email !== user?.email) throw new Error("invalid access");
    await user.setPassword(password);
    await this.userRepository.update(user);
    await this.forgotPasswordRepository.delete(forgotPassword.id);
    return user;
  }

  private async getForgotPasswordForUser(user: User): Promise<ForgotPasswordToken> {
    const { user: _, ...forgotPassword } = await createForgotPassword({ user });
    return new ForgotPasswordToken(
      await this.forgotPasswordRepository.qb.upsert({
        where: { userId: forgotPassword.userId },
        update: { id: forgotPassword.id, expiresAt: forgotPassword.expiresAt },
        create: forgotPassword,
        include: { user: true },
      }),
    );
  }
}
