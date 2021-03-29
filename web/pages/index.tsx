import React from "react";
// import useSWR from "swr";

import { Layout } from "@/app/components/layouts/layout";
// import { graphQLSdk } from "@/app/lib/api_sdk";
// import { Order } from "@/generated/graphql";

// const userFetcher = () => graphQLSdk.Users({ query: { limit: 2, order: Order.Desc } });
// const useUser = (email: string) => {
//   const { data, error } = useSWR(email, userFetcher);

//   const list = data?.users.data;
//   const cursor = data?.users.cursor;

//   return {
//     list,
//     cursor,
//     isLoading: !error && !data,
//     isError: error,
//   };
// };

export default function IndexPage() {
  // const { list, cursor, isLoading, isError } = useUser("jason@raimondi.us");

  // return <div>I am here</div>;

  const template = (
    <>
      <h1>h1: A Visual Type Scale</h1>
      <p>
        What looked like a small patch of purple grass, above five feet square, was moving across the sand in their
        direction.
      </p>
      <p>
        When it came near enough he perceived that it was not grass; there were no blades, but only purple roots. The
        roots were revolving, for each small plant in the whole patch, like the spokes of a rimless wheel.
      </p>
      <h2>h2: A Visual Type Scale</h2>
      <p>
        What looked like a small patch of purple grass, above five feet square, was moving across the sand in their
        direction.
      </p>
      <p>
        When it came near enough he perceived that it was not grass; there were no blades, but only purple roots. The
        roots were revolving, for each small plant in the whole patch, like the spokes of a rimless wheel.
      </p>
      <h3>h3: A Visual Type Scale</h3>
      <p>
        What looked like a small patch of purple grass, above five feet square, was moving across the sand in their
        direction.
      </p>
      <p>
        When it came near enough he perceived that it was not grass; there were no blades, but only purple roots. The
        roots were revolving, for each small plant in the whole patch, like the spokes of a rimless wheel.
      </p>
      <h4>h4: A Visual Type Scale</h4>
      <p>
        What looked like a small patch of purple grass, above five feet square, was moving across the sand in their
        direction.
      </p>
      <p>
        When it came near enough he perceived that it was not grass; there were no blades, but only purple roots. The
        roots were revolving, for each small plant in the whole patch, like the spokes of a rimless wheel.
      </p>
      <h5>h5: A Visual Type Scale</h5>
      <p>
        What looked like a small patch of purple grass, above five feet square, was moving across the sand in their
        direction.
      </p>
      <h6>h6: A Visual Type Scale</h6>
      <p>
        When it came near enough he perceived that it was not grass; there were no blades, but only purple roots. The
        roots were revolving, for each small plant in the whole patch, like the spokes of a rimless wheel.
      </p>
      <p>Excerpt from A Voyage to Arcturus, by David Lindsay.</p>
    </>
  );

  return <Layout title="Home">{[1, 2, 3, 4, 5, 6].map(() => template)}</Layout>;
}
