import { Query, Resolver } from "type-graphql";

import { AppInfoResponse } from "~/modules/app/info/app_info_response";
import { author, license, name, version } from "~package.json";

@Resolver()
export class AppResolver {
  @Query(() => AppInfoResponse!)
  info(): AppInfoResponse {
    return { author, license, name, version };
  }
}
