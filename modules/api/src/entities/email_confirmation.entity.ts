import { ObjectType } from "@nestjs/graphql";

import { ENV } from "~/config/environment";

import { BaseUserToken, UserTokenConstructor, PrismaUserToken } from "@modules/prisma/models";
import { UserTokenType,  } from "@modules/prisma/client";

type ICreateEmailConfirmationToken = Omit<UserTokenConstructor, "type" | "expiresAt"> & { expiresAt?: Date };

export const toEmailConfirmationToken = (userToken: PrismaUserToken) => new EmailConfirmationToken(userToken);

@ObjectType()
export class EmailConfirmationToken extends BaseUserToken {
  static create(entity: ICreateEmailConfirmationToken) {
    return new EmailConfirmationToken({
      ...entity,
      expiresAt: entity.expiresAt ?? new Date(Date.now() + ENV.ttl.emailConfirmationToken),
      type: UserTokenType.emailConfirmation,
    });
  }
}
