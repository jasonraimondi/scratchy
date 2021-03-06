import { Injectable } from "@nestjs/common";

import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class EmailConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<EmailConfirmationToken> {
    const token = await this.prisma.emailConfirmationToken.findFirst({
      rejectOnNotFound: true,
      where: {
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    });
    return new EmailConfirmationToken(token);
  }

  async findById(id: string): Promise<EmailConfirmationToken> {
    const token = await this.prisma.emailConfirmationToken.findUnique({
      rejectOnNotFound: true,
      where: { id },
      include: { user: true },
    });
    return new EmailConfirmationToken(token);
  }

  async delete(id: string) {
    await this.prisma.emailConfirmationToken.delete({ where: { id } });
  }

  async create(emailConfirmation: EmailConfirmationToken): Promise<EmailConfirmationToken> {
    const { user, ...data } = emailConfirmation;
    const token = await this.prisma.emailConfirmationToken.create({ data });
    return new EmailConfirmationToken(token);
  }
}
