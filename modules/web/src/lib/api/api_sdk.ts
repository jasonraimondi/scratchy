import sdk from "@modules/web-api-client";

const apiUrl = import.meta.env.VITE_API_URL + "graphql";

const { graphQLClient, graphQLSdk } = sdk(apiUrl);

export { graphQLClient, graphQLSdk };
