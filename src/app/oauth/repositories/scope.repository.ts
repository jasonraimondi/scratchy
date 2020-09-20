import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Scope } from "~/app/oauth/entities/scope.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class ScopeRepo extends BaseRepo<Scope> {
  constructor(@InjectRepository(Scope) repository: Repository<Scope>) {
    super(repository);
  }

  async getScopesByIdentifier(scopeNames: string[]) {
    return this.qb.where("scopes.name IN (:...names)", { names: scopeNames }).getMany();
  }

  get qb() {
    return this.repository.createQueryBuilder("scopes");
  }
}
