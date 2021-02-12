import React from "react";
import useSWR from "swr";

import { Layout } from "@/app/components/layouts/layout";
import { graphQLSdk } from "@/app/lib/api_sdk";

const meFetcher = () => graphQLSdk.Me();
const useMe = () => {
  const res = useSWR("me-query", meFetcher);
  const { data, error } = res;
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default function Profile() {
  const { data, isLoading, isError } = useMe();

  let body;

  if (isError) {
    body = <div>failed to load</div>;
  } else if (isLoading) {
    body = <div>loading...</div>;
  } else {
    body = <div>hello {JSON.stringify(data)}!</div>;
  }

  return (
    <Layout title="profile" isPrivate={true}>
      <ul>
        <li><a href="#">Revoke Refresh Token</a></li>
        <li><a href="#">Send Email Verification</a></li>
      </ul>
      {body}
    </Layout>
  );
}
