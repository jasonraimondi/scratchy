import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { User } from "~/entities/user.entity";
import { AuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { CurrentUser } from "~/lib/decorators/context_user.decorator";

@Resolver()
export class MeResolver {
  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
