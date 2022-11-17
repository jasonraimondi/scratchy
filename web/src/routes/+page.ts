import { trpc } from "$lib/api/trpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
  const prints = await trpc.print.list.query({
    limit: Number(url.searchParams.get("limit")) || 2,
    cursor: url.searchParams.get("cursor"),
  });
  return { prints };
};
