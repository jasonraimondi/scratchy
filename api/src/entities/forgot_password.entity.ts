import { UserTokenType } from "~/generated/client";
import { ObjectType } from "@nestjs/graphql";

import { ENV } from "~/config/environment";
import { UserTokenConstructor, PrismaUserToken } from "~/generated/entities";
import { UserTokenEntity } from "~/entities/abstract/user_token.entity";

export type ICreateForgotPasswordToken = Omit<UserTokenConstructor, "type" | "expiresAt"> & { expiresAt?: Date };

@ObjectType()
export class ForgotPasswordToken extends UserTokenEntity {
  static create(entity: ICreateForgotPasswordToken) {
    return new ForgotPasswordToken({
      ...entity,
      expiresAt: entity.expiresAt ?? new Date(Date.now() + ENV.ttl.emailConfirmationToken),
      type: UserTokenType.forgotPassword,
    });
  }

  static fromPrisma(hash: PrismaUserToken): ForgotPasswordToken {
    return new ForgotPasswordToken(hash);
  }
}
