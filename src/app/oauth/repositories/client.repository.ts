import { GrantIdentifier, OAuthClientRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { BaseRepo } from "~/app/database/base.repository";

@Injectable()
export class ClientRepo extends BaseRepo<Client> implements OAuthClientRepository {
  constructor(@InjectRepository(Client) repository: Repository<Client>) {
    super(repository);
  }

  async getByIdentifier(clientId: string): Promise<Client> {
    const client = await this.findById(clientId);
    return client;
  }

  async isClientValid(grantType: GrantIdentifier, client: Client, clientSecret?: string): Promise<boolean> {
    // if (client.secret !== clientSecret) {
    //   return false;
    // }
    return client.allowedGrants.includes(grantType);
  }
}
