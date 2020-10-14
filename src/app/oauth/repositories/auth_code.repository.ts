import { DateInterval, OAuthAuthCodeRepository } from "@jmondi/oauth2-server";
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

  getByIdentifier(authCodeCode: string): Promise<AuthCode> {
    return this.findById(authCodeCode);
  }

  async isRevoked(authCodeCode: string): Promise<boolean> {
    const authCode = await this.getByIdentifier(authCodeCode);
    console.log({ authCode, revoked: authCode.isExpired });
    return authCode.isExpired;
  }

  issueAuthCode(client: Client, user: User | undefined, scopes: Scope[]) {
    const authCode = new AuthCode({ user, client });
    scopes.forEach((scope) => {
      if (authCode.scopes) {
        authCode.scopes.push(scope);
      } else {
        authCode.scopes = [scope];
      }
    });
    console.log(new Date());
    console.log(new DateInterval("1m").getEndDate());
    console.log(authCode);
    return authCode;
  }

  async persist(authCode: AuthCode): Promise<void> {
    await this.create(authCode);
  }

  async revoke(authCodeCode: string): Promise<void> {
    const authCode = await this.getByIdentifier(authCodeCode);
    authCode.revoke();
    await this.save(authCode);
  }
}
