import { graphQLSdk } from "$lib/api/api_sdk";

export async function load({ params }: any) {
  const res = await graphQLSdk.UserById({ id: params.id });
  return { user: res.userById };
}
