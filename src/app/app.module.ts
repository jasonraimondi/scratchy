import { Module } from "@nestjs/common";

import { AppController } from "~/app/app.controller";
import { AuthModule } from "~/app/auth/auth.module";

@Module({
  controllers: [AppController],
  imports: [AuthModule],
})
export class AppModule {}
