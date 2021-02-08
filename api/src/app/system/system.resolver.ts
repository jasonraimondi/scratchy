import { Query, Resolver } from "@nestjs/graphql";

import { SystemInfoResponse } from "~/app/system/dtos/system_info.response";
import { author, license, name, version } from "../../../package.json";

@Resolver()
export class SystemResolver {
  @Query(() => SystemInfoResponse!)
  info(): SystemInfoResponse {
    return { author, license, name, version };
  }
}
