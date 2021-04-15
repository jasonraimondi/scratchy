import useSWR from "swr";

import { graphQLSdk } from "@/app/lib/api_sdk";

export const userFetcher = (email: string) => graphQLSdk.User({ email });
export const useUser = (email: string) => {
  const { data, error } = useSWR(email, userFetcher);
  return {
    data,
    error,
    isLoading: !error && !data,
  };
};

export const meFetcher = () => graphQLSdk.Me();
export const useMe = () => {
  const res = useSWR(`graphql.me`, meFetcher);
  const { data, error } = res;
  return {
    data,
    error,
    isLoading: !error && !data,
  };
};
