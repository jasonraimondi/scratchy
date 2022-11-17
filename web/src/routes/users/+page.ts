import { trpc } from "$lib/api/trpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
  const users = await trpc.user.list.query({
    limit: 5,
    cursor: url.searchParams.get("cursor"),
  });
  return { users };
};
