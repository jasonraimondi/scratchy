import { z } from "zod";

import { publicProcedure, router } from "$trpc/trpc";
import { prisma } from "$db";
import { prismaUserByEmail, prismaUserById } from "$db/user";

export const userRouter = router({
  get: publicProcedure
    .input(
      z.union([
        z.object({
          id: z.string().uuid(),
        }),
        z.object({
          email: z.string().email(),
        }),
      ]),
    )
    .query(async ({ input }) => {
      if ("email" in input) return await prismaUserByEmail(input.email);
      return prismaUserById(input.id);
    }),
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.string().nullish(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      console.log(input);
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;
      const items = await prisma.user.findMany({
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }
      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
});
