import { DateInterval, OAuthTokenRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { ENV } from "~/config/configuration";
import { User } from "~/app/user/entities/user.entity";
import { generateRandomToken } from "~/lib/utils/random_token";
import { BaseRepo } from "~/app/database/base.repository";

@Injectable()
export class TokenRepo extends BaseRepo<Token> implements OAuthTokenRepository {
  constructor(@InjectRepository(Token) repository: Repository<Token>) {
    super(repository);
  }

  async findById(id: string): Promise<Token> {
    return super.findById(id, {
      join: {
        alias: "token",
        leftJoinAndSelect: {
          user: "token.user",
        },
      },
    });
  }

  async issueToken(client: Client, scopes: Scope[], user?: User): Promise<Token> {
    const accessToken = new Token({ client });
    accessToken.user = user;
    accessToken.userId = user?.id;
    scopes.forEach((scope) => {
      if (accessToken.scopes) {
        accessToken.scopes.push(scope);
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

  async issueRefreshToken(accessToken: Token): Promise<Token> {
    accessToken.refreshToken = generateRandomToken();
    accessToken.refreshTokenExpiresAt = new DateInterval(
      ENV.oauth.authorizationServer.refreshTokenDuration,
    ).getEndDate();
    return await this.save(accessToken);
  }

  async persist(accessToken: Token): Promise<void> {
    await this.save(accessToken);
  }

  async revoke(accessToken: Token): Promise<void> {
    accessToken.revoke();
    await this.save(accessToken);
  }
}
