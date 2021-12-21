import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { BullMqClient } from "bull-mq-transport";
import { v4 } from "uuid";

import { QUEUE } from "~/config";

@Injectable()
export class EmailService {
  constructor(private readonly client: BullMqClient) {}

  send(payload: ISendMailOptions) {
    return this.client.emit(QUEUE.email, { id: v4(), payload }).subscribe();
  }
}
