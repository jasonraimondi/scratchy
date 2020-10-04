import { OAuthTokenRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { User } from "~/entity/user/user.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class TokenRepo extends BaseRepo<Token> implements OAuthTokenRepository {
  constructor(@InjectRepository(Token) repository: Repository<Token>) {
    super(repository);
  }

  async issueToken(client: Client, scopes: Scope[], user?: User): Promise<Token> {
    const accessToken = new Token({ client });
    accessToken.user = user;
    accessToken.userId = user?.id;
    scopes.forEach((scope) => {
      if (accessToken.scopes) {
        accessToken.scopes.push(scope)
      } else {
        accessToken.scopes = [scope];
      }
    });
    return accessToken;
  }

  async getByRefreshToken(refreshTokenToken: string): Promise<Token> {
    return this.findOneBy({ refreshToken: refreshTokenToken });
  }

  async isRefreshTokenRevoked(token: Token): Promise<boolean> {
    return Date.now() > (token.refreshTokenExpiresAt?.getTime() ?? 0);
  }

  async issueRefreshToken(): Promise<[string, Date]> {
    return ["", new Date()];
  }

  async persist(accessToken: Token): Promise<void> {
    await this.save(accessToken);
  }

  async revoke(accessToken: Token): Promise<void> {
    accessToken.revoke();
    await this.save(accessToken);
  }

  // async revoke(accessTokenToken: string): Promise<void> {
  //   const accessToken = await this.findById(accessTokenToken);
  //
  // }
}
