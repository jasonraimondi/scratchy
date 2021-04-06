import { Injectable } from "@nestjs/common";

import { PrismaService } from "~/lib/database/prisma.service";
import { User, UserModel } from "~/app/user/entities/user.entity";
import { UserPaginatorResponse } from "~/lib/database/dtos/responses/user_paginator.response";
import { UserPaginatorInputs } from "~/lib/database/dtos/inputs/paginator.inputs";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async list(params: UserPaginatorInputs = {}): Promise<UserPaginatorResponse> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
    return {
      meta: {
        nextLink: "@TODO",
        previousLink: "@TODO",
      },
      data: users.map((u) => new User(u)),
    };
  }

  async update(user: User) {
    const { permissions, roles, ...userData } = user;
    return new User(
      await this.prisma.user.update({
        where: { id: user.id },
        data: userData,
      }),
    );
  }

  async create(user: User): Promise<User> {
    const { permissions, roles, ...userData } = user;
    return new User(await this.prisma.user.create({ data: userData }));
  }

  async findByEmail(email: string): Promise<User> {
    return new User(
      await this.prisma.user.findFirst({
        rejectOnNotFound: true,
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
      }),
    );
  }

  async findById(userId: string): Promise<User> {
    return new User(
      await this.prisma.user.findUnique({
        rejectOnNotFound: true,
        where: { id: userId },
      }),
    );
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
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 },
      },
    });
  }
}
