import { graphQLSdk } from "$lib/api/api_sdk";
import { error } from "@sveltejs/kit";

export async function load({ params }: any) {
  const { listPrintsAvailable } = await graphQLSdk.listPrintsAvailable();

  const print = listPrintsAvailable.find(print => print.slug === params.slug);

  if (print) {
    return { print };
  }

  throw error(404, "Print not found");
}
