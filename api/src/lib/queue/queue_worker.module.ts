import { Module } from "@nestjs/common";
import nunjucks from "nunjucks";

import { EmailModule } from "~/lib/email/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { QueueModule } from "~/lib/queue/queue.module";
import { SendEmailProcessor } from "~/lib/queue/processors/email/send_email.processor";
import { DatabaseModule } from "~/lib/database/database.module";
import { ENV } from "~/config/environment";

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
