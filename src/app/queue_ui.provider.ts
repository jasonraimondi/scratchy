import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { setQueues } from "bull-board";
import { Queue } from "bull";

import { QUEUE } from "~/lib/config/keys";

@Injectable()
export class QueueUIProvider {
  constructor(@InjectQueue(QUEUE.email) private readonly queueOne: Queue) {
    setQueues([queueOne]);
  }
}
