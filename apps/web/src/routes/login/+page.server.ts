import { redirect } from "@sveltejs/kit";
import { getTokenFromEndpoint } from "$lib/utils/getTokenFromEndpoint";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }: any) {

  const token = getTokenFromEndpoint(cookies)

  if (token.isAuthorized) {
    throw redirect(307, "/app");
  }

  return {};
}