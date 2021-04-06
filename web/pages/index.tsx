import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useUser } from "@/app/api/user";

export default function IndexPage() {
  const { email } = useUser("jason@raimondi.us");

  return (
    <Layout title="Home">
      {[1, 2, 3].map(id => (
        <div key={id} style={{ padding: "2em 0" }}>
          {template(email)}
        </div>
      ))}
    </Layout>
  );
}

export const template = (email: string) => (
  <>
    <h1>h1: A Visual Type "{email}"</h1>
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
