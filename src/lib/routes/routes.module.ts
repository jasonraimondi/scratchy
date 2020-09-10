import { Module } from "@nestjs/common";
import { routesProviders } from "~/lib/routes/routes.provider";

@Module({
  providers: [...routesProviders],
  exports: [...routesProviders],
})
export class RoutesModule {}
