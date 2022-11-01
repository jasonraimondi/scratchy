import { graphQLSdk } from "$lib/api/api_sdk";

export async function load() {
  const { listPrintsAvailable } = await graphQLSdk.ListPrintsAvailable();
  return { listPrintsAvailable };
}
