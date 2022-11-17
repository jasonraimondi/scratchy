import { publicProcedure, router } from "$trpc/trpc";
import { prisma } from "$db";
import { z } from "zod";

export const printRouter = router({
  get: publicProcedure
    .input(
      z.object({
        slug: z.string().min(2),
      }),
    )
    .query(async ({ input }) => {
      return prisma.print.findFirstOrThrow({ where: { slug: input.slug } });
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
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;
      const items = await prisma.print.findMany({
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
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }
      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
});
