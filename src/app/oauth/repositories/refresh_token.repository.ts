import { OAuthRefreshTokenRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";

import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class RefreshTokenRepo extends BaseRepo<RefreshToken> implements OAuthRefreshTokenRepository {
  constructor(@InjectRepository(RefreshToken) repository: Repository<RefreshToken>) {
    super(repository);
  }

  async getNewToken(accessToken: AccessToken) {
    return new RefreshToken({ accessToken });
  }

  async persistNewRefreshToken(refreshToken: RefreshToken) {
    await this.save(refreshToken);
  }
}
