import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "~/lib/repository/base_repository";
import { EmailConfirmation } from "~/entity/user/email_confirmation_entity";

export interface IEmailConfirmationRepository
  extends IBaseRepository<EmailConfirmation> {
  findByEmail(email: string): Promise<EmailConfirmation>;
}

@EntityRepository(EmailConfirmation)
export class EmailConfirmationRepository extends Repository<EmailConfirmation>
  implements IEmailConfirmationRepository {
  findByEmail(email: string): Promise<EmailConfirmation> {
    return this.findOneOrFail({
      join: {
        alias: "user_confirmation",
        leftJoinAndSelect: {
          user: "user_confirmation.user",
        },
      },
      where: {
        "user.email = :email": {
          email,
        },
      },
    });
  }

  findById(id: string): Promise<EmailConfirmation> {
    return this.findOneOrFail(id, {
      join: {
        alias: "user_confirmation",
        leftJoinAndSelect: {
          user: "user_confirmation.user",
        },
      },
    });
  }
}
