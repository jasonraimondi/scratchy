import { GraphQLClient } from "graphql-request";

import type { SdkFunctionWrapper } from "$api/graphql";
import { getSdk } from "$api/graphql";

const apiUrl = import.meta.env.VITE_API_URL + "graphql";

console.log({ apiUrl });

function sdk(graphqlLink: string) {
  const graphQLClient = new GraphQLClient(graphqlLink, {
    credentials: "same-origin",
  });

  const clientTimingWrapper: SdkFunctionWrapper = async <T>(action: () => Promise<T>): Promise<T> => {
    const startTime = Date.now();
    const result = await action();
    console.log(`request duration ${Date.now() - startTime}ms`);
    return result;
  };

  const graphQLSdk = getSdk(graphQLClient, clientTimingWrapper);

  return {
    graphQLClient,
    graphQLSdk,
  };
}

export const { graphQLClient, graphQLSdk } = sdk(apiUrl);
