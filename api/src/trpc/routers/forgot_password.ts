import { z } from "zod";

import { publicProcedure, router } from "$trpc/trpc";
import { prismaUserTokenByEmail, prismaUserTokenById } from "$db/user_token";
import { TRPCError } from "@trpc/server";
import { prismaUserUpdate } from "$db/user";
import { UserTokenType } from "$generated/client";
import { PasswordSchema } from "$trpc/routers/update_password";
import { hashPassword } from "$lib/utils/password";
import { prisma } from "$db";
import { logger } from "$lib/utils/logger";
import { forgotPasswordMailer } from "$lib/mailers/forgot_password_mailer";

export const forgotPasswordRouter = router({
  validateForgotPasswordToken: publicProcedure
    .input(
      z.object({
        token: z.string().uuid(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const forgotPassword = await prismaUserTokenById(input.token);
      const isValidEmail = forgotPassword.user.email.toLowerCase() !== input.email.toLowerCase();
      if (isValidEmail) throw new TRPCError({ code: "BAD_REQUEST" });
      return true;
    }),
  sendForgotPasswordEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const forgotPassword = await prismaUserTokenByEmail({
        email: input.email,
        type: UserTokenType.forgotPassword,
      });
      await forgotPasswordMailer({
        email: input.email,
        token: forgotPassword.id,
      });
      return true;
    }),
  updatePasswordFromToken: publicProcedure
    .input(
      z.object({
        password: PasswordSchema,
        token: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const { user, ...forgotPassword } = await prismaUserTokenById(input.token);
      user.passwordHash = await hashPassword(input.password);
      await prisma.$transaction([
        prismaUserUpdate(user),
        prisma.userToken.delete({
          where: { id: forgotPassword.id },
        }),
      ]);
      logger.warning("we need to remove the passwordHash from all responses");
      return user;
    }),
});
