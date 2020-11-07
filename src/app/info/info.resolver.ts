import { Query, Resolver } from "@nestjs/graphql";

import { InfoResponse } from "~/app/info/dtos/info.response";
import { author, license, name, version } from "../../../package.json";

@Resolver()
export class InfoResolver {
  @Query(() => InfoResponse!)
  info(): InfoResponse {
    return { author, license, name, version };
  }
}
