import { Module } from "@nestjs/common";
import nunjucks from "nunjucks";

import { EmailModule } from "~/app/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { QueueModule } from "~/app/queues/queue.module";
import { SendEmailProcessor } from "~/app/queue-workers/processors/email/send_email.processor";
import { DatabaseModule } from "~/app/database/database.module";
import { ENV } from "~/config/configuration";

@Module({
  imports: [EmailModule, LoggerModule, QueueModule, DatabaseModule],
  providers: [SendEmailProcessor],
})
export class QueueWorkerModule {
  constructor() {
    nunjucks.configure(ENV.templatesDir, {
      autoescape: true,
    });
  }
}
