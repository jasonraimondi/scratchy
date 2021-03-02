import { Module } from "@nestjs/common";

import { HealthcheckController } from "~/app/system/controllers/healthcheck.controller";

@Module({
  controllers: [HealthcheckController],
})
export class SystemModule {}
