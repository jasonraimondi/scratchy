import { OAuthAccessTokenRepository, OAuthScope } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class AccessTokenRepo extends BaseRepo<AccessToken> implements OAuthAccessTokenRepository {
  constructor(@InjectRepository(AccessToken) repository: Repository<AccessToken>) {
    super(repository);
  }

  async getNewToken(client: Client, scopes: OAuthScope[] | Scope[], userId?: string): Promise<AccessToken> {
    const accessToken = new AccessToken({ client });
    accessToken.userId = userId;
    scopes.forEach((scope) => {
      if (scope instanceof Scope) {
        if (accessToken.scopes) accessToken.scopes?.push(scope);
        else accessToken.scopes = [scope];
      }
    });
    return accessToken;
  }

  async persistNewAccessToken(accessToken: AccessToken) {
    await this.save(accessToken);
  }
}
