import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context, getTokenFromBearerString } from "./context";
import { TokenService } from "~/lib/services/auth/token_service";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const middleware = t.middleware;

const currentUser = middleware(async ({ next, ctx }) => {
  const authorization = ctx.req.headers["authorization"];
  const accessToken = getTokenFromBearerString(authorization);
  if (typeof accessToken !== "string") {
    return next({ ctx });
  }
  const token = await TokenService.verifyToken(accessToken).catch();
  return next({
    ctx: {
      ...ctx,
      user: token?.user,
    },
  });
});

const isAuthed = middleware(async ({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});
export const protectedProcedure = t.procedure.use(currentUser).use(isAuthed);
export const publicProcedure = t.procedure;
