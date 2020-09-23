import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "~/app/oauth/entities/client.entity";

import { Scope } from "~/app/oauth/entities/scope.entity";
import { GrantId } from "~/app/oauth/grants/abstract.grant";
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

  async finalizeScopes(scopes: Scope[], identifier: GrantId, client: Client, user_id?: string): Promise<Scope[]> {
    // @todo important!!!
    console.log("MUST IMPLEMENT FINALIZE SCOPES");
    return scopes;
  }
}
