import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { GrantId } from "~/app/oauth/grants/abstract.grant";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class ClientRepo extends BaseRepo<Client> {
  constructor(@InjectRepository(Client) repository: Repository<Client>) {
    super(repository);
  }

  async getClientById(clientId: string): Promise<Client> {
    const client = await this.findById(clientId);
    return client;
  }

  async validateClient(grantType: GrantId, clientId: string, clientSecret?: string): Promise<boolean> {
    const client = await this.getClientById(clientId);
    if (client.secret === clientSecret) {
      return false;
    }
    if (!client.allowedGrants.includes(grantType)) {
      return false;
    }
    return true;
  }
}
