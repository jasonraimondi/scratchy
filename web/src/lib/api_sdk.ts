import { GraphQLClient } from "graphql-request";

// import { getAuthHeaders } from "@/app/lib/utils/auth_headers";
import { getSdk } from "@/generated/graphql";

const graphQLClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}graphql`, {
  credentials: "include",
});

const graphQLSdk = getSdk(graphQLClient);

export { graphQLClient, graphQLSdk };
