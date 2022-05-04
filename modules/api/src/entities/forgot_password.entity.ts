import { UserTokenType } from "@modules/prisma/client";
import { ObjectType } from "@nestjs/graphql";
import { ENV } from "~/config/environment";
import { BaseUserToken, UserTokenConstructor, PrismaUserToken } from "@modules/prisma/models";

type ICreateForgotPasswordToken = Omit<UserTokenConstructor, "type" | "expiresAt"> & { expiresAt?: Date };

export const toForgotPasswordToken = (userToken: PrismaUserToken) => new ForgotPasswordToken(userToken);

@ObjectType()
export class ForgotPasswordToken extends BaseUserToken {
  static create(entity: ICreateForgotPasswordToken) {
    return new ForgotPasswordToken({
      ...entity,
      expiresAt: entity.expiresAt ?? new Date(Date.now() + ENV.ttl.emailConfirmationToken),
      type: UserTokenType.emailConfirmation,
    });
  }
}
