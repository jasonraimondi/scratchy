import { graphQLSdk } from "$lib/api/api_sdk";
import type { RequestEvent } from "@sveltejs/kit/types/private";

export async function get(e: RequestEvent) {
  const { users } = await graphQLSdk.Users({
    input: {
      cursorId: e.url.searchParams.get("cursorId"),
    },
  });

  return {
    body: {
      users: users.data,
      cursorId: users.cursorId,
    },
  };
}
