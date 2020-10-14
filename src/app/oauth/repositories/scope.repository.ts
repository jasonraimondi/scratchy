import { GrantIdentifier, OAuthScopeRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "~/app/oauth/entities/client.entity";

import { Scope } from "~/app/oauth/entities/scope.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class ScopeRepo extends BaseRepo<Scope> implements OAuthScopeRepository {
  constructor(@InjectRepository(Scope) repository: Repository<Scope>) {
    super(repository);
  }

  async finalize(
    scopes: Scope[],
    identifier: GrantIdentifier,
    client: Client,
    userIdentifier?: string,
  ): Promise<Scope[]> {

    console.log("SCOPES", client.scopes?.map(scope => scope.name))

    return scopes;
  }

  async getAllByIdentifiers(scopeNames: string[]): Promise<Scope[]> {
    return this.qb.where("scopes.name IN (:...names)", { names: scopeNames }).getMany();
  }

  private get qb() {
    return this.repository.createQueryBuilder("scopes");
  }
}
