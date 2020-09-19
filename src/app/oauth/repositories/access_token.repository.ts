import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class AccessTokenRepo extends BaseRepo<AccessToken> {
  constructor(@InjectRepository(AccessToken) repository: Repository<AccessToken>) {
    super(repository);
  }
}
