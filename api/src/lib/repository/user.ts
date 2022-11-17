import type { User } from "$generated/client";
import { Provider } from "$generated/client";
import { prisma } from "~/lib/repository/index";
import { OAuthUser } from "$server/oauth2/auth";

export function prismaUserById(id: string) {
  return prisma.user.findFirstOrThrow({
    where: { id },
  });
}

export function prismaUserUpdate(user: User) {
  return prisma.user.update({ where: { id: user.id }, data: user });
}

export function prismaUserCreate(user: User) {
  return prisma.user.create({ data: user });
}

export function prismaUserByEmail(email: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
}

type IncrementData = {
  userId: string;
  ipAddr: string;
};
export async function prismaUserIncrementLastLogin(data: IncrementData): Promise<void> {
  await prisma.user.update({
    where: { id: data.userId },
    data: {
      lastLoginAt: new Date(),
      lastLoginIP: data.ipAddr,
    },
  });
}

export async function prismaUserByProvider(
  provider: Provider,
  oauthUser: OAuthUser,
): Promise<User> {
  const userProvider = await prisma.userProvider.findFirstOrThrow({
    where: {
      provider,
      providerId: oauthUser.id,
    },
    include: {
      user: true,
    },
  });
  return userProvider.user;
}
