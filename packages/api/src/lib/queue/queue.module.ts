import { DynamicModule, Module } from "@nestjs/common";

// import { QueueUIProvider } from "~/app/queues/queue_ui.provider";
// import { ENV } from "~/config/environment";
// import { QUEUE } from "~/config/queues";

const queues: DynamicModule[] = [
  // BullModule.registerQueue({
  //   name: QUEUE.email,
  //   redis: ENV.queueURL,
  // }),
];

@Module({
  // providers: [QueueUIProvider],
  imports: [...queues],
  exports: [...queues],
})
export class QueueModule {}
