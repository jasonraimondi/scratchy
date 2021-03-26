import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { PrismaService } from "~/lib/database/prisma.service";

export class EmailConfirmationRepo {
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
    return Object.assign(token, new EmailConfirmationToken());
  }

  async findById(id: string): Promise<EmailConfirmationToken> {
    const token = await this.prisma.emailConfirmationToken.findUnique({
      rejectOnNotFound: true,
      where: { id },
      include: { user: true },
    });
    return Object.assign(token, new EmailConfirmationToken());
  }

  async delete(id: string) {
    await this.prisma.emailConfirmationToken.delete({ where: { id } });
  }

  async create(emailConfirmation: EmailConfirmationToken) {
    const { user, ...data } = emailConfirmation;
    const u = await this.prisma.emailConfirmationToken.create({ data });
    return Object.assign(u, new EmailConfirmationToken());
  }
}
