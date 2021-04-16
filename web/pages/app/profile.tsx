import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useApiMe } from "@/app/api/user";
import { useAuth } from "@/app/lib/use_auth";
import { UpdatePasswordForm } from "@/app/components/forms/update-password-form";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { useCurrentUser } from "@/app/lib/use_current_user";

function Me() {
  const { data, error, isLoading } = useApiMe();

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return (
      <pre>
        <code>{JSON.stringify(error, null, 2)}</code>
      </pre>
    );
  }

  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export function RevokeToken() {
  const { logout } = useAuth();
  const { userId } = useCurrentUser();

  async function handleRevokeToken() {
    if (userId && confirm("Are you sure?")) {
      await graphQLSdk.RevokeRefreshTokensForUser({ userId });
      await logout();
    }
  }

  return (
    <a className="button" data-test="revoke-refresh-token" onClick={handleRevokeToken}>
      Revoke Refresh Token
    </a>
  );
}

export default function Profile() {
  return (
    <Layout title="profile" isPrivate={true}>
      <RevokeToken />
      <UpdatePasswordForm />
      <Me />
    </Layout>
  );
}
