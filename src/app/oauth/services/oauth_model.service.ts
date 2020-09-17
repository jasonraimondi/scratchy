import { Injectable, UnauthorizedException } from "@nestjs/common";
import OAuth2Server, { AuthorizationCodeModel, Client } from "oauth2-server";
import { AccessTokenRepo } from "~/app/oauth/repository/access_token.repository";
import { AuthorizationCodeRepo } from "~/app/oauth/repository/authorization_code.repository";
import { ClientRepo } from "~/app/oauth/repository/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repository/refresh_token.repository";
import { AuthorizationCode } from "~/entity/oauth/authorization_code.entity";
import { LoggerService } from "~/lib/logger/logger.service";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Injectable()
export class OAuthModelService implements AuthorizationCodeModel {
  constructor(
    private readonly userRepository: UserRepo,
    private readonly clientRepository: ClientRepo,
    private readonly accessTokenRepository: AccessTokenRepo,
    private readonly refreshTokenRepository: RefreshTokenRepo,
    private readonly authCodeRepository: AuthorizationCodeRepo,
    private readonly logger: LoggerService,
  ) {}

  async getAccessToken(token: string): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
    const accessToken = await this.accessTokenRepository.findById(token, {
      relations: ["refreshToken"],
    });
    return {
      accessTokenExpiresAt: undefined,
      refreshToken: accessToken.refreshToken?.token,
      refreshTokenExpiresAt: accessToken.refreshToken?.expiresAt,
      scope: undefined,
      client: accessToken.client,
      user: accessToken.user,
      accessToken: accessToken.token,
    };
  }

  async getAuthorizationCode(code: string): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
    const authorizationCode = await this.authCodeRepository.findById(code, {
      relations: ["client", "user"],
    });
    return {
      authorizationCode: authorizationCode.token,
      expiresAt: authorizationCode.expiresAt,
      redirectUri: authorizationCode.redirectUri,
      client: authorizationCode.client,
      user: authorizationCode.user,
    };
  }

  async getClient(clientId: string, clientSecret: string): Promise<OAuth2Server.Client> {
    const client = await this.clientRepository.findById(clientId);
    if (clientSecret !== client.secret) {
      console.log("INVALID SECRET");
      throw new UnauthorizedException();
    }
    console.log("get client success");
    return client;
  }

  async getRefreshToken(refreshToken: string): Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey> {
    console.log("get refresh token");
    return undefined;
  }

  async getUser(username: string, password?: string): Promise<OAuth2Server.User | OAuth2Server.Falsey> {
    console.log("get user");
    const user = await this.userRepository.findByEmail(username);
    console.log(username, password);
    return user;
  }

  async getUserFromClient(client: OAuth2Server.Client): Promise<OAuth2Server.User | OAuth2Server.Falsey> {
    console.log({ client });
    return undefined;
  }

  async revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode | AuthorizationCode): Promise<boolean> {
    console.log("revoke authorization code", code);
    // @todo requerying when we have the object already, we need the class...
    const authCode = await this.authCodeRepository.findById(code.token);
    authCode.revoke();
    await this.authCodeRepository.save(authCode);
    return true;
  }

  async revokeToken(token: OAuth2Server.RefreshToken | OAuth2Server.Token): Promise<boolean> {
    console.log({ token });
    return true;
  }

  async saveAuthorizationCode(
    code: Pick<OAuth2Server.AuthorizationCode, "authorizationCode" | "expiresAt" | "redirectUri" | "scope">,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
    console.log({ client, user });
    return undefined;
  }

  async saveToken(
    token: OAuth2Server.Token,
    oauthClient: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
    const refreshToken = await this.refreshTokenRepository.create({
      token: token.refreshToken,
      expiresAt: token.refreshTokenExpiresAt,
    });
    const client = await this.clientRepository.findById(oauthClient.id);
    await this.accessTokenRepository.create({
      refreshToken,
      client,
      user,
      token: token.accessToken,
      expiresAt: token.accessTokenExpiresAt,
    });
    const result = {
      ...token,
      client: oauthClient,
      user,
    };
    console.log("save token", result);
    return result;
  }

  async verifyScope(token: OAuth2Server.Token, scope: string | string[]): Promise<boolean> {
    console.log({ token, scope });
    return true;
  }
}
