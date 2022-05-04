import type { RequestEvent } from "@sveltejs/kit/types/private";

import { graphQLSdk } from "$lib/api/api_sdk";
import { getTokenFromEndpoint, UNAUTHORIZED_RESPONSE } from "$lib/utils/getTokenFromEndpoint";

export async function get({ request }: RequestEvent) {
  const { isUnauthorized } = getTokenFromEndpoint(request);

  if (isUnauthorized) return UNAUTHORIZED_RESPONSE;

  const { me } = await graphQLSdk.Me();

  return {
    body: { me },
  };
}
