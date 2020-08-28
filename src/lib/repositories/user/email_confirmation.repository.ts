import { EntityRepository, Repository } from "typeorm";

import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { IBaseRepository } from "~/lib/repositories/base.repository";

export interface IEmailConfirmationRepository extends IBaseRepository<EmailConfirmationToken> {
  findByEmail(email: string): Promise<EmailConfirmationToken>;
}

@EntityRepository(EmailConfirmationToken)
export class EmailConfirmationRepository extends Repository<EmailConfirmationToken>
  implements IEmailConfirmationRepository {
  async findByEmail(email: string): Promise<EmailConfirmationToken> {
    const emailConfirmationToken = await this.createQueryBuilder("email_confirmation_tokens")
      .leftJoinAndSelect("email_confirmation_tokens.user", "users")
      .where("users.email = :email", { email })
      .getOne();
    if (!emailConfirmationToken) throw new Error(`Could not find any entity of type "${EmailConfirmationToken.name}"`)
    return emailConfirmationToken;
  }

  findById(id: string): Promise<EmailConfirmationToken> {
    return this.findOneOrFail(id, {
      join: {
        alias: "email_confirmation_tokens",
        leftJoinAndSelect: {
          user: "email_confirmation_tokens.user",
        },
      },
    });
  }
}
