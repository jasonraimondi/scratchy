import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import type { FastifyReply } from "fastify";
import { Res } from "@nestjs/common";

@Resolver()
export class LogoutService {
  constructor(private userRepository: UserRepository) {}

  @Mutation(() => Boolean)
  async logout(@Res() _res: FastifyReply) {
    // @todo fix logout
    console.error("ON HO IMPLEMENT THIS!!");
    // res.cookie()
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Args({ name: "userId", type: () => String }) userId: string) {
    try {
      await this.userRepository.findById(userId);
      // @todo fix increment token
      // await this.userRepository.incrementToken(userId);
      return true;
    } catch {
      return false;
    }
  }
}
