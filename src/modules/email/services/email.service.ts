import { Queue } from "bull";
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { ISendMailOptions } from "@nestjs-modules/mailer";

import { QUEUE, QUEUE_JOBS } from "~/config/inversify";

@Injectable()
export class EmailService {
  constructor(@InjectQueue(QUEUE.email) private readonly emailQueue: Queue) {}

  send(data: ISendMailOptions) {
    return this.emailQueue.add(QUEUE_JOBS.email.send, data);
  }
}
