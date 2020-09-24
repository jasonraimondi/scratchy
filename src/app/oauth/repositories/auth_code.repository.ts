import { OAuthAuthCodeRepository, OAuthScope } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { User } from "~/entity/user/user.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class AuthCodeRepo extends BaseRepo<AuthCode> implements OAuthAuthCodeRepository {
  constructor(@InjectRepository(AuthCode) repository: Repository<AuthCode>) {
    super(repository);
  }

  getNewAuthCode(client: Client, user?: User, scopes: OAuthScope[] | Scope[] = []) {
    const authCode = new AuthCode({ user, client });
    scopes.forEach((scope) => {
      if (scope instanceof Scope) {
        if (authCode.scopes) authCode.scopes?.push(scope);
        else authCode.scopes = [scope];
      }
    });
    return authCode;
  }

  async persistNewAuthCode(authCode: AuthCode) {
    await this.create(authCode);
  }

  async isAuthCodeRevoked(authCodeCode: string) {
    const authCode = await this.findById(authCodeCode);
    return authCode.isExpired;
  }

  async getAuthCodeByIdentifier(authCodeCode: string) {
    return this.findById(authCodeCode);
  }

  async revokeAuthCode(authCodeCode: string) {
    const authCode = await this.findById(authCodeCode);
    authCode.revoke();
    await this.save(authCode);
  }
}
