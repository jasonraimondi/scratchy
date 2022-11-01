import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { QUEUE } from "~/config/queues";

@Injectable()
export class EmailService {
  constructor(@InjectQueue(QUEUE.email) readonly client: Queue<ISendMailOptions>) {}

  async send(payload: ISendMailOptions) {
    await this.client.add(QUEUE.email, payload);
  }
}
