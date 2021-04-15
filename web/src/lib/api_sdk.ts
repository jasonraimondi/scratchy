import { GraphQLClient } from "graphql-request";

import { getSdk } from "@/generated/graphql";

const graphQLClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}graphql`, {
  credentials: "same-origin",
});

const graphQLSdk = getSdk(graphQLClient);

export { graphQLClient, graphQLSdk };
