import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "~/app/oauth/entities/client.entity";
import { BaseRepo } from "~/lib/repositories/base.repository";

@Injectable()
export class ClientRepo extends BaseRepo<Client> {
  constructor(@InjectRepository(Client) repository: Repository<Client>) {
    super(repository);
  }

  async getClientById(clientId: string): Promise<Client> {
    return this.findById(clientId);
  }

  async validateClient(grantType: string, clientId: string, clientSecret?: string): Promise<boolean> {
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