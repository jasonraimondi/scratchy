import { GrantTypeIdentifiers, OAuthClientRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class ClientRepo extends BaseRepo<Client> implements OAuthClientRepository {
  constructor(@InjectRepository(Client) repository: Repository<Client>) {
    super(repository);
  }

  async getClientByIdentifier(clientId: string): Promise<Client> {
    return this.findById(clientId);
  }

  async isClientValid(grantType: GrantTypeIdentifiers, clientId: string, clientSecret?: string): Promise<boolean> {
    const client = await this.getClientByIdentifier(clientId);
    if (client.secret === clientSecret) {
      return false;
    }
    return client.allowedGrants.includes(grantType);
  }
}
