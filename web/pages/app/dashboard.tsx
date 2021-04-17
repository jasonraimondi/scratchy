import { Layout } from "@/app/components/layouts/layout";
import React from "react";
import { useCurrentUser } from "@/app/lib/use_current_user";

export default function Dashboard() {
  const currentUser = useCurrentUser();

  return (
    <Layout title="I am the dashboard" isPrivate={true}>
      <pre><code>
        {JSON.stringify(currentUser, null, 2)}
      </code></pre>
    </Layout>
  );
}
