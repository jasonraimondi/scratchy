import sdk from "@lib/web-api-client";

const apiUrl = import.meta.env.VITE_API_URL + "graphql";

console.log({ apiUrl });

const { graphQLClient, graphQLSdk } = sdk(apiUrl);

export { graphQLClient, graphQLSdk };
