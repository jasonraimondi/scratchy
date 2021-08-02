import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../../generated/graphql";

const graphqlLink = `https://scratchy.localdomain/api/graphql`;

const graphQLClient = new GraphQLClient(graphqlLink, {
  credentials: "same-origin",
});

const graphQLSdk = getSdk(graphQLClient);

export { graphQLClient, graphQLSdk };
