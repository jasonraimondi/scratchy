import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject } from "@nestjs/common";

import { MyContext } from "~/lib/types/my_context";
import { LoginResponse } from "~/modules/user/dtos/login_response";
import { REPOSITORY } from "~/lib/constants/inversify";
import { LoginInput } from "~/modules/user/dtos/login_input";
import { IUserRepository } from "~/lib/repository/user/user.repository";
import { AuthService } from "~/modules/auth/auth.service";

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Arg("data") { email, password, rememberMe }: LoginInput,
    @Ctx() { res }: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    await user.verify(password);

    this.authService.sendRefreshToken(res, rememberMe, user);

    await this.userRepository.incrementLastLoginAt(user);

    return {
      accessToken: this.authService.createAccessToken(user),
      user,
    };
  }

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
