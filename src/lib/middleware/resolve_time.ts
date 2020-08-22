import { MiddlewareFn } from "type-graphql";

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  const message = `${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`;

  // @ts-ignore
  if (info.is_testing) return { message, resolveTime };

  console.log(message);
  return undefined;
};
