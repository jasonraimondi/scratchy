import { Injectable } from "@nestjs/common";

import { EmailConfirmationToken, toEmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { PrismaService } from "~/lib/database/prisma.service";
import { UserTokenType } from "@modules/prisma/generated/client";

@Injectable()
export class EmailConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<EmailConfirmationToken> {
    return toEmailConfirmationToken(
      await this.prisma.userToken.findFirst({
        rejectOnNotFound: true,
        where: {
          type: UserTokenType.emailConfirmation,
          user: {
            email: {
              equals: email,
              mode: "insensitive",
            },
          },
        },
        include: {
          user: true,
        },
      }),
    );
  }

  async findById(id: string): Promise<EmailConfirmationToken> {
    return toEmailConfirmationToken(
      await this.prisma.userToken.findUnique({
        rejectOnNotFound: true,
        where: { id },
        include: { user: true },
      }),
    );
  }

  async delete(id: string) {
    await this.prisma.userToken.delete({ where: { id } });
  }

  async create(emailConfirmation: EmailConfirmationToken): Promise<void> {
    await this.prisma.userToken.create({ data: emailConfirmation.toPrisma() });
  }
}
