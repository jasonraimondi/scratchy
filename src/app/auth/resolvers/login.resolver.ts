import { Inject } from "@nestjs/common";

import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { AuthService } from "~/app/auth/auth.service";
import { LoginInput } from "~/app/user/dtos/login.input";
import { LoginResponse } from "~/app/user/dtos/login.response";
import { REPOSITORY } from "~/lib/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/lib/types/my_context";

@Resolver()
export class LoginResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Arg("data") { email, password, rememberMe }: LoginInput,
    @Ctx() { req, res }: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    await user.verify(password);

    this.authService.sendRefreshToken(res, rememberMe, user);

    const ipAddr = req.headers?.["x-forwarded-for"] || req.connection.remoteAddress;

    await this.userRepository.incrementLastLogin(user, ipAddr);

    return {
      accessToken: this.authService.createAccessToken(user),
      user,
    };
  }
}
