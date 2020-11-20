import { Module } from "@nestjs/common";

import { EmailModule } from "~/app/emails/email.module";
import { LoggerModule } from "~/app/logger/logger.module";
import { QueueModule } from "~/app/queues/queue.module";
import { SendEmailProcessor } from "~/app/queue-workers/processors/email/send_email.processor";
import { DatabaseModule } from "~/app/database/database.module";

@Module({
  imports: [EmailModule, LoggerModule, QueueModule, DatabaseModule],
  providers: [SendEmailProcessor],
})
export class QueueWorkerModule {}
