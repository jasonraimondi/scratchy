import React from "react";
import useSWR from "swr";

import { Layout } from "@/app/components/layouts/layout";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Order } from "@/generated/graphql";

const userFetcher = () => graphQLSdk.Users({ query: { limit: 2, order: Order.Desc } });
const useUser = (email: string) => {
  const { data, error } = useSWR(email, userFetcher);

  const list = data?.users.data;
  const cursor = data?.users.cursor;

  return {
    list,
    cursor,
    isLoading: !error && !data,
    isError: error,
  };
};

export default function IndexPage() {
  const { list, cursor, isLoading, isError } = useUser("jason@raimondi.us");

  let body;

  if (isError) {
    body = <div>failed to load</div>;
  } else if (isLoading) {
    body = <div>loading...</div>;
  } else {
    body = <div>hello {JSON.stringify(cursor)} {JSON.stringify(list)}!</div>;
  }

  return <Layout title="Home">{body}</Layout>;
};
