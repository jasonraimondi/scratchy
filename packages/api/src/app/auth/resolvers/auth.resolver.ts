import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "~/app/auth/services/auth.service";
import { RefreshTokenDTO } from "~/app/auth/dto/refresh_token.dto";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";
import { LoginResponse } from "~/app/auth/resolvers/auth.response";
import { LoginInput } from "~/app/auth/resolvers/auth.input";
import { MyContext } from "~/config/context";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userRepository: UserRepository) {}

  @Mutation(() => LoginResponse!)
  async login(@Args("input") loginInput: LoginInput, @Context() { res, ipAddr }: MyContext): Promise<LoginResponse> {
    return this.authService.login({ ...loginInput, ipAddr, res });
  }

  @Mutation(() => LoginResponse!)
  refreshAccessToken(@Context() { req }: MyContext): Promise<LoginResponse> {
    const refreshToken = new RefreshTokenDTO(req.cookies?.jid);
    if (refreshToken.isExpired) throw new Error("invalid token");
    return this.authService.refreshAccessToken(refreshToken.token);
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Context() { res }: MyContext): Promise<void> {
    await this.authService.logout(res);
  }

  @UseGuards(JwtAuthGqlGuard)
  @Mutation(() => Boolean, { nullable: true })
  async revokeRefreshToken(@Context() { res }: MyContext, @Args("userId") userId: string): Promise<void> {
    await this.userRepository.incrementRefreshToken(userId);
    await this.authService.logout(res);
  }
}
