import { DynamicModule, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

import { ENV } from "~/config/environment";

const queues: DynamicModule[] = [
  BullModule.forRoot({
    connection: ENV.queue,
  }),
];

@Module({
  // providers: [QueueUIProvider],
  imports: [...queues],
  exports: [...queues],
})
export class QueueModule {}
