import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { UserTokenType } from "@lib/prisma";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class ForgotPasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get repo() {
    return this.prisma.userToken;
  }

  async create(forgotPasswordToken: ForgotPasswordToken): Promise<ForgotPasswordToken> {
    return ForgotPasswordToken.fromPrisma(
      await this.repo.create({
        data: forgotPasswordToken.toPrisma(),
        include: { user: true },
      }),
    );
  }

  async findById(id: string): Promise<ForgotPasswordToken> {
    return ForgotPasswordToken.fromPrisma(
      await this.repo.findFirstOrThrow({
        where: {
          id,
          type: UserTokenType.forgotPassword,
        },
        include: { user: true },
      }),
    );
  }

  async findForUser(userId: string): Promise<ForgotPasswordToken> {
    return ForgotPasswordToken.fromPrisma(
      await this.repo.findFirstOrThrow({
        where: {
          user: {
            id: userId,
          }
        },
        include: {
          user: true,
        }
      })
    )
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ where: { id } });
  }
}
