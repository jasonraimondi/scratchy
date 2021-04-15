import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useMe } from "@/app/api/user";
import { useAuth } from "@/app/lib/use_auth";

function Me() {
  const { data, error, isLoading } = useMe();

  let body;

  if (isLoading) {
    body = <div>loading...</div>;
  } else if (error) {
    body = <pre><code>{JSON.stringify(error, null, 2)}</code></pre>;
  } else {
    body = <pre><code>{JSON.stringify(data, null, 2)}</code></pre>;
  }
  console.log("JASON")
  return body;
}

// if any data requests are happening in the nextjs page, it will fail
export default function Profile() {
  const auth = useAuth();
  return (
    <Layout title="profile" isPrivate={true}>
      <ul>
        <li>
          <a className="button" data-test="revoke-refresh-token" onClick={auth.handleRevokeToken}>
            Revoke Refresh Token
          </a>
        </li>
        <li>
          <a className="button" data-test="update-password">Update Password</a>
        </li>
      </ul>
      <Me />
    </Layout>
  );
}
