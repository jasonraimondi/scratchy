import { graphQLSdk } from "$lib/api/api_sdk";

/** @type {import("./$types").PageLoad} */
export async function load() {
  const { users } = await graphQLSdk.Users();
  return {
    users: users.data,
    cursorId: users.cursorId,
  };
}
