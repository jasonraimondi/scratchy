import { Query, Resolver } from "type-graphql";

import { AppInfoResponse } from "~/app/info/info/info.response";
import { author, license, name, version } from "../../../package.json";

@Resolver()
export class AppResolver {
  @Query(() => AppInfoResponse!)
  info(): AppInfoResponse {
    return { author, license, name, version };
  }
}
