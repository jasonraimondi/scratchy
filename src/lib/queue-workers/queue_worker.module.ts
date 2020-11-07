import { Module } from "@nestjs/common";

import { EmailModule } from "~/lib/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { QueueModule } from "~/lib/queues/queue.module";
import { SendEmailProcessor } from "~/lib/queue-workers/processors/send_email.processor";
import { DatabaseModule } from "~/lib/database/database.module";

@Module({
  imports: [EmailModule, LoggerModule, QueueModule, DatabaseModule],
  providers: [SendEmailProcessor],
})
export class QueueWorkerModule {}
