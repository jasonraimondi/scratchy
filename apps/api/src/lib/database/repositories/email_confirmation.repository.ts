import { Injectable } from "@nestjs/common";

import { EmailConfirmationToken, toEmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { PrismaService } from "~/lib/database/prisma.service";
import { UserTokenType } from "@lib/prisma";

@Injectable()
export class EmailConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  private get repo() {
    return this.prisma.userToken;
  }

  async findByEmail(email: string): Promise<EmailConfirmationToken> {
    return toEmailConfirmationToken(
      await this.repo.findFirst({
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
      await this.repo.findUnique({
        rejectOnNotFound: true,
        where: { id },
        include: { user: true },
      }),
    );
  }

  async delete(id: string) {
    await this.repo.delete({ where: { id } });
  }

  async create(emailConfirmation: EmailConfirmationToken): Promise<void> {
    await this.repo.create({ data: emailConfirmation.toPrisma() });
  }
}
