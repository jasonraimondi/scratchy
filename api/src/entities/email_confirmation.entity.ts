import { ObjectType } from "@nestjs/graphql";
import { UserTokenType } from "~/generated/client";

import { UserTokenConstructor, PrismaUserToken } from "~/generated/entities";
import { ENV } from "~/config/environment";
import { UserTokenEntity } from "~/entities/abstract/user_token.entity";

export type ICreateEmailConfirmationToken = Omit<UserTokenConstructor, "type" | "expiresAt"> & { expiresAt?: Date };

@ObjectType()
export class EmailConfirmationToken extends UserTokenEntity {
  static create(entity: ICreateEmailConfirmationToken) {
    return new EmailConfirmationToken({
      ...entity,
      expiresAt: entity.expiresAt ?? new Date(Date.now() + ENV.ttl.emailConfirmationToken),
      type: UserTokenType.emailConfirmation,
    });
  }

  static fromPrisma(prisma: PrismaUserToken): EmailConfirmationToken {
    return new EmailConfirmationToken(prisma);
  }
}
