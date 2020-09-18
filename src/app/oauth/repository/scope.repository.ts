import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Scope } from "~/entity/oauth/scope.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class ScopeRepo extends BaseRepo<Scope> {
  constructor(@InjectRepository(Scope) repository: Repository<Scope>) {
    super(repository);
  }
}
