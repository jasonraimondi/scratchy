import { AuthCodeGrant, ClientCredentialsGrant } from "@jmondi/oauth2-server";
import { Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repositories/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { UserRepo } from "~/lib/repositories/user/user.repository";

export const grantProviders: Provider[] = [
  {
    provide: AuthCodeGrant,
    useFactory: async (
      clientRepository: ClientRepo,
      accessTokenRepository: AccessTokenRepo,
      refreshTokenRepository: RefreshTokenRepo,
      authCodeRepository: AuthCodeRepo,
      scopeRepository: ScopeRepo,
      userRepository: UserRepo,
      jwt: JwtService,
    ) =>
      new AuthCodeGrant(
        clientRepository,
        accessTokenRepository,
        refreshTokenRepository,
        // @ts-ignore
        authCodeRepository,
        scopeRepository,
        userRepository,
        jwt,
      ),
    inject: [ClientRepo, AccessTokenRepo, RefreshTokenRepo, AuthCodeRepo, ScopeRepo, UserRepo, JwtService],
  },
  {
    provide: ClientCredentialsGrant,
    useFactory: async (
      clientRepository: ClientRepo,
      accessTokenRepository: AccessTokenRepo,
      refreshTokenRepository: RefreshTokenRepo,
      authCodeRepository: AuthCodeRepo,
      scopeRepository: ScopeRepo,
      userRepository: UserRepo,
      jwt: JwtService,
    ) =>
      new ClientCredentialsGrant(
        clientRepository,
        accessTokenRepository,
        refreshTokenRepository,
        // @ts-ignore
        authCodeRepository,
        scopeRepository,
        userRepository,
        jwt,
      ),
    inject: [ClientRepo, AccessTokenRepo, RefreshTokenRepo, AuthCodeRepo, ScopeRepo, UserRepo, JwtService],
  },
];
export const repositoryProviders: Provider[] = [ClientRepo, AccessTokenRepo, RefreshTokenRepo, AuthCodeRepo, ScopeRepo];
