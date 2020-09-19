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
}
