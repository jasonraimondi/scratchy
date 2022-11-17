import { prisma } from "$lib/repository";
import { CredentialsLoginSchema } from "$lib/services/auth/login";
import { AuthService } from "$lib/services/auth/auth_service";
import { COOKIES } from "$config/cookies";
import { protectedProcedure, publicProcedure, router } from "$trpc/trpc";

export const authRouter = router({
  login: publicProcedure
    .input(CredentialsLoginSchema)
    .mutation(async ({ input, ctx }): Promise<AuthService.LoginResponse> => {
      const loginInput = Object.assign(input, { ipAddr: ctx.ipAddr });
      const loginResponse = await AuthService.login(loginInput);
      AuthService.setRefreshTokenCookie(
        ctx.res,
        loginResponse.refreshToken,
        loginResponse.refreshTokenExpiresAt,
      );
      return {
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        accessTokenExpiresAt: loginResponse.accessTokenExpiresAt,
        refreshTokenExpiresAt: loginResponse.refreshTokenExpiresAt,
      };
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    AuthService.setRefreshTokenCookie(ctx.res);
    return true;
  }),
  revokeRefreshToken: protectedProcedure.mutation(async ({ ctx }) => {
    await prisma.user
      .update({
        where: { id: ctx.user.id },
        data: {
          tokenVersion: { increment: 1 },
        },
      })
      .finally(() => {
        AuthService.setRefreshTokenCookie(ctx.res);
      });
  }),
  refreshAccessToken: publicProcedure.mutation(async ({ ctx }) => {
    return AuthService.refreshAccessToken(ctx.req.cookies?.[COOKIES.refreshToken]);
  }),
});
