import useSWR from "swr";

import { graphQLSdk } from "@/app/lib/api_sdk";

export const userFetcher = (email: string) => graphQLSdk.User({ email });

export const useUser = (email: string) => {
  const { data, error } = useSWR(email, userFetcher);

  return {
    ...data?.user,
    isLoading: !error && !data,
    isError: error,
  };
};
