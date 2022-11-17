import { trpc } from "$lib/api/trpc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const print = await trpc.print.get.query({
    slug: params.slug,
  });
  return { print };
};
