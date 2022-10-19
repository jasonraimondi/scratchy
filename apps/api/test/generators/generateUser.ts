import { randEmail, randFirstName } from "@ngneat/falso";

import { ICreateUser, User } from "~/entities/user.entity";
import { EmailConfirmationToken, ICreateEmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { PrismaService } from "~/lib/database/prisma.service";
import { ForgotPasswordToken, ICreateForgotPasswordToken } from "~/entities/forgot_password.entity";

export async function generateUser(
  prisma: PrismaService,
  u?: Partial<ICreateUser> & { isEmailConfirmed?: boolean },
): Promise<User> {
  const user = await User.create({
    email: randEmail(),
    nickname: randFirstName(),
    password: "testing123",
    createdIP: "127.0.0.2",
    isEmailConfirmed: true,
    ...u,
  });
  return User.fromPrisma(
    await prisma.user.create({
      data: user.toPrisma(),
    }),
  );
}

export async function generateEmailConfirmationToken(
  prisma: PrismaService,
  e: ICreateEmailConfirmationToken,
): Promise<EmailConfirmationToken> {
  const token = await EmailConfirmationToken.create({
    ...e,
    userId: e.userId,
  });
  return EmailConfirmationToken.fromPrisma(
    await prisma.userToken.create({
      data: token.toPrisma(),
    }),
  );
}

export async function generateForgotPasswordToken(
  prisma: PrismaService,
  e: ICreateForgotPasswordToken,
): Promise<ForgotPasswordToken> {
  const token = await ForgotPasswordToken.create({
    ...e,
    userId: e.userId,
  });
  return ForgotPasswordToken.fromPrisma(
    await prisma.userToken.create({
      data: token.toPrisma(),
    }),
  );
}
