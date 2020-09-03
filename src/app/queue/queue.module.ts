import { Module } from "@nestjs/common";
import { QueueUIProvider } from "~/app/queue/queue_ui.provider";

@Module({
  providers: [QueueUIProvider]
})
export class QueueModule {

}
