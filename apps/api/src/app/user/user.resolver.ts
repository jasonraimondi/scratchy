import { Args, Query, Resolver } from "@nestjs/graphql";

import { UserPaginatorResponse } from "~/app/user/dtos/user.dto";
import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { paginatorInputs, paginatorResponse } from "~/lib/utils/paginator";
import { UserPaginatorInput } from "@lib/prisma";

@Resolver()
export class UserResolver {
  constructor(private readonly prisma: PrismaService, private readonly userRepository: UserRepository) {}

  @Query(() => User!)
  userById(@Args("id") id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  @Query(() => User!)
  userByEmail(@Args("email") email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  @Query(() => UserPaginatorResponse!)
  async users(@Args("input", { nullable: false }) input: UserPaginatorInput): Promise<UserPaginatorResponse> {
    const users = await this.prisma.user.findMany({
      ...paginatorInputs(input),
    });
    const result = new UserPaginatorResponse();
    result.data = users.map(u => new User(u));
    return paginatorResponse(input, result);
  }
}
