import { Module } from "@nestjs/common";
import { SystemResolver } from "~/app/system/system.resolver";

@Module({
  providers: [SystemResolver],
})
export class SystemModule {}
