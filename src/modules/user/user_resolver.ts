import { Arg, Query, Resolver } from "type-graphql";
import { inject, injectable } from "tsyringe";

import { IUserRepository } from "~/lib/repository/user_repository";
import { User } from "~/entities/user";

@injectable()
@Resolver()
export class UserResolver {
  constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}

  @Query(() => User)
  async user(@Arg("id") id: string) {
    return await this.userRepository.findById(id);
  }

  // @Query(() => [User])
  // users() {
  //   return this.userRepository.find();
  // }
}
