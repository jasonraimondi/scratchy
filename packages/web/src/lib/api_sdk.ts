import { GraphQLClient } from "graphql-request";

import { getSdk } from "@/generated/graphql";

const graphqlLink = `${process.env.NEXT_PUBLIC_API_URL}graphql`;

console.log({ graphqlLink });

const graphQLClient = new GraphQLClient(graphqlLink, {
  credentials: "same-origin",
});

const graphQLSdk = getSdk(graphQLClient);

export { graphQLClient, graphQLSdk };
