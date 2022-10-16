import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import crypto from "crypto";

import { User } from "~/entities/user.entity";

@Resolver(() => User)
export class UserEntityResolver {
  @ResolveField(() => String!)
  async gravatar(@Parent() user: User, @Args("size", { nullable: true }) size?: number) {
    if (!size) size = 500;
    if (!user.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    const md5 = crypto.createHash("md5").update(user.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
  }
}
