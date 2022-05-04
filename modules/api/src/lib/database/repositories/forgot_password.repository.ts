import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken, toForgotPasswordToken } from "~/entities/forgot_password.entity";
import { UserTokenType } from "@modules/prisma/generated/client";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class ForgotPasswordRepository {
  private readonly repo = this.prisma.userToken;
  constructor(private readonly prisma: PrismaService) {
  }

  async create(forgotPasswordToken: ForgotPasswordToken): Promise<ForgotPasswordToken> {
    return toForgotPasswordToken(
      await this.repo.create({
        data: forgotPasswordToken.toPrisma(),
        include: { user: true },
      }),
    );
  }

  async findById(id: string): Promise<ForgotPasswordToken> {
    return toForgotPasswordToken(
      await this.repo.findFirst({
        rejectOnNotFound: true,
        where: {
          id,
          type: UserTokenType.resetPassword,
        },
        include: { user: true },
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ where: { id } });
  }
}
