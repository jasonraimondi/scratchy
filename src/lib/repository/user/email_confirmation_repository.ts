import { EntityRepository, Repository } from "typeorm";

import { EmailConfirmation } from "~/entity/user/email_confirmation_entity";
import { IBaseRepository } from "~/lib/repository/base_repository";

export interface IEmailConfirmationRepository extends IBaseRepository<EmailConfirmation> {
  findByEmail(email: string): Promise<EmailConfirmation>;
}

@EntityRepository(EmailConfirmation)
export class EmailConfirmationRepository extends Repository<EmailConfirmation> implements IEmailConfirmationRepository {
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

  findById(uuid: string): Promise<EmailConfirmation> {
    return this.findOneOrFail(uuid, {
      join: {
        alias: "user_confirmation",
        leftJoinAndSelect: {
          user: "user_confirmation.user",
        },
      },
    });
  }
}
