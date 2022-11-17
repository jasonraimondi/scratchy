import { v4 } from "uuid";

import type { UserToken } from "$generated/client";
import { UserTokenType } from "$generated/client";
import { TTL } from "$config/env";

type CreateUserToken = {
  userId: string;
  type: UserTokenType;
};

function createUserToken({ userId, type }: CreateUserToken) {
  return {
    id: v4(),
    expiresAt: new Date(Date.now() + TTL.emailConfirmationToken),
    createdAt: new Date(),
    type,
    userId,
  };
}

export function createEmailConfirmationToken(userId: string): UserToken {
  return createUserToken({
    type: UserTokenType.emailConfirmation,
    userId,
  });
}

export function createForgotPasswordToken(userId: string): UserToken {
  return createUserToken({
    type: UserTokenType.forgotPassword,
    userId,
  });
}
