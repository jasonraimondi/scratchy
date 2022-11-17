import type { User } from "$generated/client";
import { createHash } from "node:crypto";
import { z } from "zod";

import { protectedProcedure, router } from "$trpc/trpc";

function gravatar(user: Pick<User, "email">, size?: number) {
  if (!size) size = 500;
  if (!user.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  const md5 = createHash("md5").update(user.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
}

export const meRouter = router({
  me: protectedProcedure
    .input(z.object({ gravatarSize: z.number().optional() }).optional())
    .query(async ({ input, ctx }) => {
      return {
        ...ctx.user,
        gravatar: gravatar(ctx.user, input?.gravatarSize),
        isAdmin: ctx.user.roles.includes("admin"),
      };
    }),
});
