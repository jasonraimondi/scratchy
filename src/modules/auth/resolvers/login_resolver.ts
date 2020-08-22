import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject } from "@nestjs/common";

import { MyContext } from "~/lib/types/my_context";
import { LoginResponse } from "~/modules/user/dtos/login_response";
import { REPOSITORY } from "~/config/inversify";
import { LoginInput } from "~/modules/user/dtos/login_input";
import { AuthService } from "~/modules/auth/auth.service";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class LoginResolver {
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
}
