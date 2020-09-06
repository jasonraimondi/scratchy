import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

import { ENV } from "~/lib/config/environment";
import { MyContext } from "~/lib/config/my_context";

export interface AuthContext {
  userId: string;
  email: string;
  isEmailConfirmed: boolean;
}

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.get("authorization");
  if (!authorization) {
    throw new Error("not authenticated");
  }
  try {
    const token = authorization.split(" ")[1];
    const decodedToken: any = verify(token, ENV.accessTokenSecret);
    context.auth = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      isEmailConfirmed: decodedToken.isEmailConfirmed,
    };
  } catch (err) {
    throw new Error("not authenticated");
  }

  return await next();
};