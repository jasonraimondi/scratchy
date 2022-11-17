import { UserToken, UserTokenType } from "$generated/client";
import { prisma } from "~/lib/repository/index";

export function prismaUserTokenCreate(data: UserToken) {
  return prisma.userToken.create({ data });
}

export function prismaUserTokenById(id: string) {
  return prisma.userToken.findFirstOrThrow({
    where: { id },
    include: { user: true },
  });
}

export type UserTokenByEmailArgs = {
  type: UserTokenType;
  email: string;
};

export function prismaUserTokenByEmail(input: UserTokenByEmailArgs) {
  return prisma.userToken.findFirstOrThrow({
    where: {
      type: input.type,
      user: {
        email: {
          equals: input.email,
          mode: "insensitive",
        },
      },
    },
    include: {
      user: true,
    },
  });
}
