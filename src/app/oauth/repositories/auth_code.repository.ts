import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { User } from "~/entity/user/user.entity";

import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class AuthCodeRepo extends BaseRepo<AuthCode> {
  constructor(@InjectRepository(AuthCode) repository: Repository<AuthCode>) {
    super(repository);
  }

  getNewAuthCode(client: Client, user?: User, scopes: Scope[] = []): AuthCode {
    return new AuthCode({ user, client, scopes });
  }

  async persistNewAuthCode(authCode: AuthCode): Promise<AuthCode> {
    return this.create(authCode);
  }
}
