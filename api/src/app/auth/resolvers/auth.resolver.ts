import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { AuthService } from "~/app/auth/services/auth.service";
import { RefreshTokenDTO } from "~/app/auth/dto/refresh_token.dto";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { AuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { LoginResponse } from "~/app/auth/dto/auth.dtos";
import { LoginInput } from "~/app/auth/dto/auth.dtos";
import { MyContext } from "~/config/graphql";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userRepository: UserRepository) {}

  @Mutation(() => LoginResponse!)
  async login(@Args("input") loginInput: LoginInput, @Context() context: MyContext): Promise<LoginResponse> {
    const { res, ipAddr } = context;
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

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  async revokeRefreshToken(@Context() { res }: MyContext, @Args("userId") userId: string): Promise<void> {
    await this.userRepository.incrementRefreshToken(userId);
    await this.authService.logout(res);
  }
}
