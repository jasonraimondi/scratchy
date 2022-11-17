import { FastifyReply, FastifyRequest } from "fastify";
import type { Provider, User } from "$generated/client";
import { OAuth2Namespace } from "@fastify/oauth2";
import { WEB_ROUTES } from "$config/urls";
import { AuthService } from "$lib/services/auth/auth_service";
import { prismaUserByEmail, prismaUserByProvider } from "$db/user";
import { createUser } from "$entities/user";
import { prisma } from "$db";

export type OAuthUser = {
  id: string;
  email?: string | null;
  [key: string]: unknown;
};

export async function handleOAuthLogin(
  req: FastifyRequest,
  res: FastifyReply,
  provider: Provider,
  providerRef: OAuth2Namespace,
  profile: (token: string) => Promise<OAuthUser>,
) {
  const token = await providerRef.getAccessTokenFromAuthorizationCodeFlow(req);
  const oauthUser = await profile(token.token.access_token);

  let user: User;

  if (typeof oauthUser.email !== "string") {
    // @todo throw a better error message here
    return res.status(400).send({
      success: false,
      message: "email is missing from " + provider,
    });
  }

  try {
    user = await prismaUserByProvider(provider, oauthUser);
  } catch (e) {
    try {
      user = await prismaUserByEmail(oauthUser.email);
    } catch (e) {
      const newUser = await createUser({
        email: oauthUser.email,
        password: null,
        nickname: typeof oauthUser.nickname === "string" ? oauthUser.nickname : null,
        createdIP: req.ip,
        isEmailConfirmed: true,
      });
      user = await prisma.user.create({
        data: {
          ...newUser,
          providers: {
            create: {
              provider,
              providerId: oauthUser.id,
            },
          },
        },
        include: { providers: true },
      });
    }
  }

  const loginResponse = await AuthService.login({
    user,
    ipAddr: req.ip,
    rememberMe: true,
  });

  AuthService.setRefreshTokenCookie(
    res,
    loginResponse.refreshToken,
    loginResponse.refreshTokenExpiresAt,
  );

  const toURL = WEB_ROUTES.oauth_callback.create({
    token: loginResponse.accessToken,
  });

  return res.status(302).redirect(toURL);
}
