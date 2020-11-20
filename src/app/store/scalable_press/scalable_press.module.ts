import { HttpModule, Module } from "@nestjs/common";

import { ScalablePressResolver } from "~/app/store/scalable_press/scalable_press.resolver";
import { ENV } from "~/config/configuration";
import { ScalablePressService } from "~/app/store/scalable_press/scalable_press.service";
import { base64encode } from "~/lib/utils/base64";
import { LoggerModule } from "~/app/logger/logger.module";

@Module({
  imports: [
    HttpModule.register({
      baseURL: "https://api.scalablepress.com/v2",
      headers: {
        Authorization: `Basic ${base64encode(":" + ENV.scalablePressApiKey)}`,
        "User-Agent": "Scratchy 0.0.1",
      },
    }),
    LoggerModule,
  ],
  providers: [ScalablePressService, ScalablePressResolver],
})
export class ScalablePressModule {}
