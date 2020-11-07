import { Args, Mutation, Resolver } from "@nestjs/graphql";
import type { Response } from "express";

import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

@Resolver()
export class LogoutService {
  constructor(private userRepository: UserRepo) {}

  @Mutation(() => Boolean)
  async logout(res: Response) {
    // res.cookie()
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
