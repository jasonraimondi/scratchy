import { UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "~/app/auth/services/auth.service";
import { RefreshTokenDTO } from "~/app/auth/dto/refresh_token.dto";
import { LoginResponse } from "~/app/user/resolvers/account/responses/login_response";
import { MyContext } from "~/lib/graphql/my_context";
import { LoginInput } from "~/app/user/resolvers/account/inputs/login_input";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userRepository: UserRepository) {}

  @Mutation(() => LoginResponse!)
  async login(@Args("data") loginInput: LoginInput, @Context() { res, ipAddr }: MyContext): Promise<LoginResponse> {
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
