import { DateInterval } from "@jmondi/date-interval";
import { HttpStatus } from "@nestjs/common";
import { Request } from "express";

import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { OAuthException } from "~/app/oauth/oauth.exception";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { arrayDiff } from "~/lib/helpers/array";
import { base64decode } from "~/lib/utils/base64";

export interface IGrantType {
  readonly GRANT_TYPE: string;

  validateAuthorizationRequest(req: Request): any;

  canRespondToAuthorizationRequest(req: Request): boolean;
}

export abstract class AbstractGrant implements IGrantType {
  protected readonly SCOPE_DELIMITER_STRING = " ";

  abstract readonly GRANT_TYPE: string;

  protected constructor(
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly scopeRepository: ScopeRepo,
  ) {
  }

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

  protected async validateScopes(scopes: string | string[]) {
    if (typeof scopes === "string") {
      scopes = scopes.split(this.SCOPE_DELIMITER_STRING);
    }

    const validScopes = await this.scopeRepository.getScopesByIdentifier(scopes);

    const invalidScopes = arrayDiff(
      scopes,
      validScopes.map((scope) => scope.name),
    );

    if (invalidScopes.length > 0) {
      throw OAuthException.invalidRequest(`invalid scopes: (${invalidScopes.join(" ")})`);
    }

    return validScopes;
  }

  protected getGrantType(request: Request): string {
    const result = request.body?.grant_type;
    if (!result) throw OAuthException.invalidRequest("grant_type");
    return result;
  }

  canRespondToAuthorizationRequest(request: Request): boolean {
    return false;
  }

  validateAuthorizationRequest(request: Request): any {
    throw new OAuthException("This grant cannot validate an authorization request", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  completeAuthorizationRequest(authorizationRequest: any) {
    throw new OAuthException("This grant cannot complete an authorization request", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
