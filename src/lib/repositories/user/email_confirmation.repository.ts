import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { BaseRepository, IBaseRepo } from "~/lib/repositories/base.repository";

export interface IEmailConfirmationRepository extends IBaseRepo<EmailConfirmationToken> {
  findByEmail(email: string): Promise<EmailConfirmationToken>;
}

export class EmailConfirmationRepository
  extends BaseRepository<EmailConfirmationToken>
  implements IEmailConfirmationRepository {
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
