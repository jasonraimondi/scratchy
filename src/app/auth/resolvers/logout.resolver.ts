import { Inject } from "@nestjs/common";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { AuthService } from "~/app/auth/auth.service";
import { REPOSITORY } from "~/lib/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/lib/types/my_context";

@Resolver()
export class LogoutResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    this.authService.sendRefreshToken(res, false, undefined);
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => String) userId: string) {
    try {
      await this.userRepository.findById(userId);
      await this.userRepository.incrementToken(userId);
      return true;
    } catch {
      return false;
    }
  }
}
