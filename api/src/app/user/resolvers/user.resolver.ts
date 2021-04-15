import { Args, Query, Resolver } from "@nestjs/graphql";

import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { UserPaginatorInputs } from "~/lib/database/dtos/inputs/paginator.inputs";
import { UserPaginatorResponse } from "~/lib/database/dtos/responses/user_paginator.response";

@Resolver()
export class UserResolver {
  constructor(private userRepository: UserRepository) {}

  @Query(() => User!)
  user(@Args("email") email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  @Query(() => UserPaginatorResponse!)
  users(@Args("query", { nullable: true }) query?: UserPaginatorInputs): Promise<UserPaginatorResponse> {
    return this.userRepository.list(query);
  }
}
