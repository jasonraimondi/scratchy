import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { v4 } from "uuid";
import { Queue } from "bullmq";

import { QUEUE } from "~/config/queues";

@Injectable()
export class EmailService {
  constructor(@InjectQueue(QUEUE.email) readonly client: Queue) {}

  async send(payload: ISendMailOptions) {
    await this.client.add("send", { id: v4(), payload });
  }
}
