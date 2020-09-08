import { Inject } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "~/app/auth/auth.service";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";

@Resolver()
export class LogoutResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  @Mutation(() => Boolean)
  async logout(@Context() { res }: MyContext) {
    this.authService.sendRefreshToken(res, false, undefined);
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
