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

  async finalizeScopes(scopes: Scope[], identifier: GrantId, client: Client, user_id?: string): Promise<Scope[]> {
    // Example of programmatically modifying the final scope of the access token
    if (user_id === "admin-user") {
      const scope = new Scope({ name: "admin" });
      scopes.push(scope);
    }

    return scopes;
  }

  private get qb() {
    return this.repository.createQueryBuilder("scopes");
  }
}
