import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";

import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class RefreshTokenRepo extends BaseRepo<RefreshToken> {
  constructor(@InjectRepository(RefreshToken) repository: Repository<RefreshToken>) {
    super(repository);
  }

  async getNewToken(accessToken: AccessToken): Promise<RefreshToken | undefined> {
    return new RefreshToken({ accessToken });
  }

  async persistNewRefreshToken(refreshToken: RefreshToken) {
    return this.save(refreshToken);
  }
}
