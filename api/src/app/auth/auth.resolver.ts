import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "~/app/auth/services/auth.service";
import { RefreshTokenDTO } from "~/app/auth/dto/refresh_token.dto";
import { LoginResponse } from "~/app/account/resolvers/auth/login_response";
import { MyContext } from "~/lib/graphql/my_context";
import { LoginInput } from "~/app/account/resolvers/auth/login_input";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userRepository: UserRepo) {}

  @Mutation(() => LoginResponse!)
  async login(
    @Args("data") { email, password, rememberMe }: LoginInput,
    @Context() { res }: MyContext,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(email, password);
    await this.authService.sendRefreshToken(res, rememberMe, result.user);
    return result;
  }

  @Mutation(() => LoginResponse!)
  async refreshToken(@Context() { req, res }: MyContext): Promise<LoginResponse> {
    const rememberMe = req.cookies?.rememberMe ?? false;
    const refreshToken = new RefreshTokenDTO(req.cookies?.jid);

    if (refreshToken.isExpired) {
      throw new Error("invalid token");
    }

    const result = await this.authService.refreshAccessToken(refreshToken.token);
    await this.authService.sendRefreshToken(res, rememberMe, result.user);

    return result;
  }

  @Mutation(() => Boolean)
  async logout(@Context() { res }: MyContext): Promise<boolean> {
    await this.authService.sendRefreshToken(res, false, undefined);
    return true;
  }

  @UseGuards(JwtAuthGqlGuard)
  @Mutation(() => Boolean)
  async revokeRefreshToken(@Context() { res }: MyContext, @Args("userId") userId: string): Promise<boolean> {
    try {
      await this.userRepository.findById(userId);
      await this.userRepository.incrementToken(userId);
      await this.authService.sendRefreshToken(res, false, undefined);
      return true;
    } catch {
      return false;
    }
  }
}
