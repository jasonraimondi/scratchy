import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class ForgotPasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(forgotPasswordToken: ForgotPasswordToken): Promise<ForgotPasswordToken> {
    const { user, ...data } = forgotPasswordToken;
    const e = await this.prisma.forgotPasswordToken.create({ data });
    return Object.assign(e, new ForgotPasswordToken);
  }

  async findById(id: string): Promise<ForgotPasswordToken> {
    const e = await this.prisma.forgotPasswordToken.findUnique({
      where: { id },
      include: { user: true },
    });
    return Object.assign(e, new ForgotPasswordToken);
  }

  async findForUser(userId: string): Promise<ForgotPasswordToken> {
    const e = await this.prisma.forgotPasswordToken.findUnique({
      where: { userId },
      include: { user: true },
    });
    return Object.assign(e, new ForgotPasswordToken);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.forgotPasswordToken.delete({ where: { id } });
  }
}
