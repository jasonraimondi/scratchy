import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { BaseRepo } from "~/lib/database/base.repository";

export class EmailConfirmationRepo extends BaseRepo<EmailConfirmationToken> {
  constructor(@InjectRepository(EmailConfirmationToken) userRepository: Repository<EmailConfirmationToken>) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<EmailConfirmationToken> {
    const emailConfirmationToken = await this.qb
      .leftJoinAndSelect("email_confirmation_tokens.user", "users")
      .where("users.email = :email", { email: email.toLowerCase() })
      .getOne();
    if (!emailConfirmationToken) throw new Error(`Could not find any entity of type "${EmailConfirmationToken.name}"`);
    return emailConfirmationToken;
  }

  async findById(id: string) {
    return super.findById(id, {
      join: {
        alias: "email_confirmation_tokens",
        leftJoinAndSelect: {
          user: "email_confirmation_tokens.user",
        },
      },
    });
  }

  private get qb() {
    return this.repository.createQueryBuilder("email_confirmation_tokens");
  }
}
