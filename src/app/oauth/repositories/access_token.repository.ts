import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class AccessTokenRepo extends BaseRepo<AccessToken> {
  constructor(@InjectRepository(AccessToken) repository: Repository<AccessToken>) {
    super(repository);
  }

  async getNewToken(client: Client, scopes: Scope[], userId: string | undefined) {
    const accessToken = new AccessToken(client);
    accessToken.userId = userId;
    // @todo check scopes
    scopes.forEach((scope) => accessToken.scopes?.push(scope) ?? [scope]);
    return accessToken;
  }

  async persistNewAccessToken(accessToken: AccessToken) {
    return await this.create(accessToken);
  }
}
