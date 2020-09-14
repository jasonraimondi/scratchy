import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "~/app/auth/auth.service";
import { LoginInput } from "~/app/user/dtos/login.input";
import { LoginResponse } from "~/app/user/dtos/login.response";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";

@Resolver()
export class LoginResolver {
  constructor(private userRepository: UserRepo, private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args("data") { email, password, rememberMe }: LoginInput,
    @Context() { ipAddr, res }: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    await user.verify(password);

    this.authService.sendRefreshToken(res, rememberMe, user);

    await this.userRepository.incrementLastLogin(user, ipAddr!);

    return {
      accessToken: this.authService.createAccessToken(user),
      user,
    };
  }
}
