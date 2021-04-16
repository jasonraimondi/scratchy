import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

import { UpdatePasswordInput } from "~/app/user/resolvers/account/inputs/forgot_password_input";
import { UserRepository } from "~/lib/database/repositories/user.repository";

@Injectable()
@Resolver()
export class UpdatePasswordResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Mutation(() => Boolean!)
  async updatePassword(@Args("data") data: UpdatePasswordInput) {
    const user = await this.userRepository.findById(data.userId);
    await user.verify(data.previousPassword);
    await user.setPassword(data.password);
    await this.userRepository.update(user);
    return true;
  }
}
