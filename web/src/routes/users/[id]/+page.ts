import { trpc } from "$lib/api/trpc";

export async function load({ params }: any) {
  const user = await trpc.user.get.query({ id: params.id });
  return { user };
}
