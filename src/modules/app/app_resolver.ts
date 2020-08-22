import { Query, Resolver } from "type-graphql";

import { AppInfoResponse } from "~/modules/app/info/app_info_response";

@Resolver()
export class AppResolver {
  @Query(() => AppInfoResponse!)
  async info(): Promise<AppInfoResponse> {
    const { author, license, name, version } = await import("~package.json");
    return { author, license, name, version };
  }
}
