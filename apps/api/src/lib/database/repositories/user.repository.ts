import { Injectable } from "@nestjs/common";
import { Prisma } from "@lib/prisma";

import { User } from "~/entities/user.entity";
import { PrismaService } from "~/lib/database/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get repo() {
    return this.prisma.user;
  }

  async update(user: User): Promise<void> {
    await this.repo.update({ where: { id: user.id }, data: user.toPrisma() });
  }

  async create(user: User): Promise<void> {
    await this.repo.create({ data: user.toPrisma() });
  }

  async findByEmail(email: string, include?: Prisma.UserInclude): Promise<User> {
    const res = await this.repo.findFirstOrThrow({
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
    return new User(await this.repo.findFirstOrThrow({ where: { id: userId }, ...extraQuery }));
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
