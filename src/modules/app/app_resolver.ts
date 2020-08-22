import { injectable } from "inversify";
import { Query, Resolver } from "type-graphql";

import { AppInfoResponse } from "~/modules/app/info/app_info_response";

const { author, license, name, version } = require("../../../package.json");

@injectable()
@Resolver()
export class AppResolver {
  @Query(() => AppInfoResponse!)
  info() {
    return { name, author, version, license };
  }
}
