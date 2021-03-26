import { Injectable } from "@nestjs/common";

import { PrismaService } from "~/lib/database/prisma.service";
import { User } from "~/app/user/entities/user.entity";
import { UserPaginatorResponse } from "~/lib/database/dtos/responses/user_paginator.response";
import { UserPaginatorInputs } from "~/lib/database/dtos/inputs/paginator.inputs";

@Injectable()
export class UserRepo {
  constructor(private prisma: PrismaService) {}

  async list(params: UserPaginatorInputs = {}): Promise<UserPaginatorResponse> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
    const data = users.map((u) => Object.assign(u, new User()));
    return {
      meta: {
        nextLink: "@TODO",
        previousLink: "@TODO",
      },
      data,
    };
  }

  async create(user: User): Promise<User> {
    const { permissions, roles, ...userData } = user;
    const u = await this.prisma.user.create({ data: userData });
    return Object.assign(u, new User());
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      rejectOnNotFound: true,
      where: {
        email: email.toLowerCase(), // @todo make this case insensitive query
      },
    });
    return Object.assign(user, new User());
  }

  async findById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      rejectOnNotFound: true,
      where: { id: userId },
    });
    return Object.assign(user, new User());
  }

  async incrementLastLogin(email: string, ipAddr: string): Promise<void> {
    await this.prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        lastLoginAt: new Date(),
        lastLoginIP: ipAddr,
      },
    });
  }

  async incrementRefreshToken(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: user.tokenVersion + 1,
      },
    });
  }
}
