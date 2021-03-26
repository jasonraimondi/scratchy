import { Injectable } from "@nestjs/common";

import { createForgotPassword, ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { ForgotPasswordEmail } from "~/app/emails/emails/forgot_password.email";
import { LoggerService } from "~/lib/logger/logger.service";
import { ForgotPasswordRepo } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepo } from "~/lib/database/repositories/user.repository";

@Injectable()
export class ForgotPasswordService {
  constructor(
    private userRepository: UserRepo,
    private forgotPasswordRepository: ForgotPasswordRepo,
    private forgotPasswordEmail: ForgotPasswordEmail,
    private logger: LoggerService,
  ) {
    logger.setContext(ForgotPasswordService.name);
  }

  async validateForgotPasswordToken(token: string, email: string) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    if (forgotPassword.user.email !== email.toLowerCase()) {
      throw new Error("invalid emails or token");
    }
    return true;
  }

  async sendForgotPasswordEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    const forgotPassword = await this.getForgotPasswordForUser(user);
    try {
      await this.forgotPasswordRepository.save(forgotPassword);
      await this.forgotPasswordEmail.send(forgotPassword);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }

  async updatePasswordFromToken(email: string, token: string, password: string) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    const { user } = forgotPassword;
    if (email !== user.email) {
      throw new Error("invalid access");
    }
    await user.setPassword(password);
    try {
      await this.userRepository.create(user);
      await this.forgotPasswordRepository.delete(forgotPassword.id);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  private async getForgotPasswordForUser(user: User) {
    try {
      return await this.forgotPasswordRepository.findForUser(user.id);
    } catch (e) {}
    const forgotPassword = await createForgotPassword({ user });
    await this.forgotPasswordRepository.save(forgotPassword);
    return forgotPassword;
  }
}
