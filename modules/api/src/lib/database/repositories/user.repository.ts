import { Injectable } from "@nestjs/common";
import { Prisma } from "@modules/prisma/client";

import { User } from "~/entities/user.entity";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class UserRepository {
  private readonly repo = this.prisma.user;

  constructor(private readonly prisma: PrismaService) {
  }

  async update(user: User): Promise<void> {
    await this.repo.update({ where: { id: user.id }, data: user.toPrisma() });
  }

  async create(user: User): Promise<void> {
    await this.repo.create({ data: user.toPrisma() });
  }

  async findByEmail(email: string, include?: Prisma.UserInclude): Promise<User> {
    const res = await this.repo.findFirst({
      rejectOnNotFound: true,
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      include,
    });
    console.log(res);
    return new User(res!);
  }

  async findById(userId: string, extraQuery: { include?: Prisma.UserInclude } = {}): Promise<User> {
    return new User(
      await this.repo.findUnique({
        rejectOnNotFound: true,
        where: { id: userId },
        ...extraQuery,
      }),
    );
  }

  async incrementLastLogin(userId: string, ipAddr: string): Promise<void> {
    await this.repo.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastLoginIP: ipAddr,
      },
    });
  }

  async incrementRefreshToken(userId: string): Promise<void> {
    await this.repo.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 },
      },
    });
  }
}
