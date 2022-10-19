import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { User } from "~/entities/user.entity";
import { ForgotPasswordMailer } from "~/lib/email/mailers/forgot_password.mailer";
import { LoggerService } from "~/lib/logger/logger.service";
import { ForgotPasswordRepository } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import {
  UpdatePasswordFromTokenInput,
  ValidateForgotPasswordTokenInput,
} from "~/app/user/forgot_password/forgot_password.input";
import { PrismaService } from "~/lib/database/prisma.service";
import { UserTokenType } from "@lib/prisma";

@Injectable()
export class ForgotPasswordService {
  constructor(
    private userRepository: UserRepository,
    private forgotPasswordRepository: ForgotPasswordRepository,
    private forgotPasswordEmail: ForgotPasswordMailer,
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  async validateForgotPasswordToken({ email, token }: ValidateForgotPasswordTokenInput) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    if (forgotPassword?.user?.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error("invalid emails or token");
    }
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
    if (!(user instanceof User) || email !== user?.email) throw new Error("invalid access");
    await user.setPassword(password);
    await this.userRepository.update(user);
    await this.forgotPasswordRepository.delete(forgotPassword.id);
    return user;
  }

  private async getForgotPasswordForUser(user: User): Promise<ForgotPasswordToken> {
    const forgotPassword = ForgotPasswordToken.create({ user, userId: user.id });
    return ForgotPasswordToken.fromPrisma(
      await this.prisma.userToken.upsert({
        where: { userId_type: { userId: forgotPassword.userId, type: UserTokenType.forgotPassword } },
        update: { id: forgotPassword.id, expiresAt: forgotPassword.expiresAt },
        create: forgotPassword.toPrisma(),
        include: { user: true },
      }),
    );
  }
}
