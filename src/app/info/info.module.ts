import { Module } from "@nestjs/common";
import { InfoResolver } from "~/app/info/info.resolver";

@Module({
  providers: [InfoResolver],
})
export class InfoModule {}
