import React from "react";
import { useAuth } from "@/app/lib/use_auth";
import { useCurrentUser } from "@/app/lib/use_current_user";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button } from "@/app/components/forms/elements";

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
    <Button
       data-test="revoke-refresh-token"
       onClick={handleRevokeToken}
    >
      Revoke Refresh Token
    </Button>
  );
}