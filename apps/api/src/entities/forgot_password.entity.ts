import { UserTokenType } from "@lib/prisma";
import { ObjectType } from "@nestjs/graphql";
import { ENV } from "~/config/environment";
import { UserTokenConstructor, PrismaUserToken } from "@lib/prisma";
import { UserTokenEntity } from "./abstract/user_token.entity";

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
