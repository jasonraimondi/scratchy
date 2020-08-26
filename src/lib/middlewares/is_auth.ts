import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { MyContext } from "~/lib/types/my_context";
import { ENV } from "~/lib/config/environment";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.get("authorization");
  if (!authorization) {
    throw new Error("not authenticated");
  }
  try {
    const token = authorization.split(" ")[1];
    const verif: any = verify(token, ENV.accessTokenSecret);
    context.auth = {
      userId: verif.userId,
      email: verif.email,
      isEmailConfirmed: verif.isEmailConfirmed,
    };
  } catch (err) {
    throw new Error("not authenticated");
  }

  return await next();
};
