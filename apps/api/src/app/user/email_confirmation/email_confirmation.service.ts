import { Injectable } from "@nestjs/common";

import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class EmailConfirmationService {
  constructor(private prisma: PrismaService, private emailConfirmationRepository: EmailConfirmationRepository) {}

  async verifyEmailConfirmation(email: string, id: string): Promise<void> {
    const confirmation = await this.emailConfirmationRepository.findById(id);

    if (confirmation.user?.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error(`invalid user and confirmation (${confirmation.user!.email}) (${email})`);
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: confirmation.userId },
        data: { isEmailConfirmed: true },
      }),
      this.prisma.userToken.delete({ where: { id: confirmation.id } }),
    ]);
  }
}
