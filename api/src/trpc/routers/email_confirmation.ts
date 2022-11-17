import { publicProcedure, router } from "$trpc/trpc";
import { z } from "zod";
import { EmailConfirmationService } from "$lib/services/email_confirmation_service";
import { AuthService } from "$lib/services/auth/auth_service";

export const emailConfirmationRouter = router({
  verifyEmailConfirmation: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const confirmation = await EmailConfirmationService.verify({
        email: input.email,
        token: input.token,
        ipAddr: ctx.ipAddr,
      });
      AuthService.setRefreshTokenCookie(
        ctx.res,
        confirmation.refreshToken,
        confirmation.refreshTokenExpiresAt,
      );
      return {
        user: confirmation.user,
        accessToken: confirmation.accessToken,
        accessTokenExpiresAt: confirmation.accessTokenExpiresAt,
        refreshTokenExpiresAt: confirmation.refreshTokenExpiresAt,
      };
    }),
});
