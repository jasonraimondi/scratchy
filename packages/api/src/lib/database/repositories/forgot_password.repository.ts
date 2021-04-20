import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class ForgotPasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  get qb() {
    return this.prisma.forgotPasswordToken;
  }

  async create(forgotPasswordToken: ForgotPasswordToken): Promise<ForgotPasswordToken> {
    const { user, ...data } = forgotPasswordToken;
    return new ForgotPasswordToken(
      await this.prisma.forgotPasswordToken.create({
        data,
        include: { user: true },
      }),
    );
  }

  async findById(id: string): Promise<ForgotPasswordToken> {
    return new ForgotPasswordToken(
      await this.prisma.forgotPasswordToken.findUnique({
        rejectOnNotFound: true,
        where: { id },
        include: { user: true },
      }),
    );
  }

  async findForUser(userId: string): Promise<ForgotPasswordToken> {
    return new ForgotPasswordToken(
      await this.prisma.forgotPasswordToken.findUnique({
        rejectOnNotFound: true,
        where: { userId },
        include: { user: true },
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.forgotPasswordToken.delete({ where: { id } });
  }
}
