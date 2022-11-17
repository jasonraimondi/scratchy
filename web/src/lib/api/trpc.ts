import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@package/server/src/trpc/routers";

import superjson from "superjson";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { accessTokenStore } from "$lib/auth/access_token";
import { get } from "svelte/store";

function removeTrailingSlash(str: string) {
  return str.replace(/\/+$/, "");
}

const config = {
  TRPC_URL_HTTP: removeTrailingSlash(import.meta.env.VITE_TRPC_URL_HTTP),
  TRPC_URL_WS: removeTrailingSlash(import.meta.env.VITE_TRPC_URL_WS),
};

const myHttpLink = httpBatchLink({
  url: config.TRPC_URL_HTTP,
  headers: () => {
    const result: Record<string, string> = {};
    const { token } = get(accessTokenStore) ?? {};
    if (token) result.Authorization = `Bearer ${token}`;
    return result;
  },
});

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    () =>
      ({ op, prev, next }: any): any => {
        console.log("TRPC =>", op);
        return next(op, (result: any) => {
          console.log("TRPC <=", op, ":", result);
          prev(result);
        });
      },
    myHttpLink,
    // browser
    //   ? splitLink({
    //       condition(op) {
    //         return op.type === "subscription";
    //       },
    //       true: wsLink({ client: createWSClient({ url: config.TRPC_URL_WS }) }),
    //       false: httpBatchLink({
    //         url: config.TRPC_URL_HTTP,
    //       }),
    //     })
    //   : httpBatchLink({ url: config.TRPC_URL_HTTP }),
  ],
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
