import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthorizationCode } from "~/entity/oauth/authorization_code.entity";

import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class AuthorizationCodeRepo extends BaseRepo<AuthorizationCode> {
  constructor(@InjectRepository(AuthorizationCode) repository: Repository<AuthorizationCode>) {
    super(repository);
  }
}
