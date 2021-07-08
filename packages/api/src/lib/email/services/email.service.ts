import { ISendMailOptions } from "@nestjs-modules/mailer";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { QUEUE, QUEUE_JOBS } from "~/config/queues";

@Injectable()
export class EmailService {
  constructor(@InjectQueue(QUEUE.email) private readonly emailQueue: Queue) {}

  send(data: ISendMailOptions) {
    return this.emailQueue.add(QUEUE_JOBS.email.send, data);
  }
}
