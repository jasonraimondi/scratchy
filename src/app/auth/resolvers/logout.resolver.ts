import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { UserRepo } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";

@Resolver()
export class LogoutResolver {
  constructor(private userRepository: UserRepo) {}

  @Mutation(() => Boolean)
  async logout(@Context() { res }: MyContext) {
    console.log("FIX LOGOUT");
    // @todo fix logout
    // this.authService.sendRefreshToken(res, false, undefined);
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Args({ name: "userId", type: () => String }) userId: string) {
    try {
      await this.userRepository.findById(userId);
      await this.userRepository.incrementToken(userId);
      return true;
    } catch {
      return false;
    }
  }
}
