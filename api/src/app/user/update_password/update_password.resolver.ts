import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

import { UserRepository } from "~/lib/database/repositories/user.repository";
import { UpdatePasswordInput } from "~/app/user/update_password/update_password.input";

@Injectable()
@Resolver()
export class UpdatePasswordResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Mutation(() => Boolean!)
  async updatePassword(@Args("input") data: UpdatePasswordInput) {
    const user = await this.userRepository.findById(data.userId);
    await user.verify(data.currentPassword);
    await user.setPassword(data.password);
    if (data.revokeToken) user.tokenVersion++;
    await this.userRepository.update(user);
    return true;
  }
}
