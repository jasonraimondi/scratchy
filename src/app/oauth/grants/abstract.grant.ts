import { DateInterval } from "@jmondi/date-interval";
import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { AuthCodeGrant } from "~/app/oauth/grants/auth_code.grant";
import { ClientCredentialsGrant } from "~/app/oauth/grants/client_credentials.grant";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { arrayDiff } from "~/lib/helpers/array";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { base64decode } from "~/lib/utils/base64";

export type IGrantType = ClientCredentialsGrant | AuthCodeGrant;

export type GrantType = "authorization_code" | "client_credentials";

@Injectable()
export abstract class AbstractGrant {
  protected readonly scopeDelimiterString = " ";

  protected readonly supportedGrantTypes: GrantType[] = ["client_credentials", "authorization_code"];

  abstract readonly identifier: GrantType;

  protected constructor(
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly authCodeRepo: AuthCodeRepo,
    protected readonly scopeRepository: ScopeRepo,
    protected readonly userRepository: UserRepo,
    protected readonly jwt: JwtService,
  ) {}

  protected getBasicAuthCredentials(request: Request) {
    if (!request.headers?.hasOwnProperty("authorization")) {
      return [undefined, undefined];
    }

    const header = request.headers["authorization"];

    if (!header || !header.startsWith("Basic ")) {
      return [undefined, undefined];
    }

    const decoded = base64decode(header.substr(6, header.length));

    if (!decoded.includes(":")) {
      return [undefined, undefined];
    }

    return decoded.split(":");
  }

  protected async issueAccessToken(
    accessTokenTTL: DateInterval,
    client: Client,
    userId?: string,
    scopes: Scope[] = [],
  ): Promise<AccessToken> {
    const accessToken = await this.accessTokenRepository.getNewToken(client, scopes, userId);
    accessToken.expiresAt = accessTokenTTL.end();
    return await this.accessTokenRepository.persistNewAccessToken(accessToken);
  }

  protected async validateScopes(scopes: string | string[], redirectUri?: string) {
    if (typeof scopes === "string") {
      scopes = scopes.split(this.scopeDelimiterString);
    }

    const validScopes = await this.scopeRepository.getScopesByIdentifier(scopes);

    const invalidScopes = arrayDiff(
      scopes,
      validScopes.map((scope) => scope.name),
    );

    if (invalidScopes.length > 0) {
      throw OAuthException.invalidScopes(invalidScopes, redirectUri);
    }

    return validScopes;
  }

  protected getGrantType(request: Request): GrantType {
    const result = request.body?.grant_type ?? request.query?.grant_type;
    if (!result) throw OAuthException.invalidRequest("grant_type");
    if (!this.supportedGrantTypes.includes(result)) throw OAuthException.invalidRequest("grant_type");
    return result;
  }

  protected encrypt(unencryptedData: string): Promise<string> {
    return this.jwt.signAsync(unencryptedData);
  }

  protected decrypt(encryptedData: string) {
    return this.jwt.decode(encryptedData);
  }
}
