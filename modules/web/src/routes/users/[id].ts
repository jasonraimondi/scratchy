import { graphQLSdk } from "$lib/api/api_sdk";
import type { RequestEvent } from "@sveltejs/kit/types/private";

export async function get({ params }: RequestEvent) {
  const res = await graphQLSdk.UserById({ id: params.id });
  return {
    body: { user: res.userById },
  };
}
