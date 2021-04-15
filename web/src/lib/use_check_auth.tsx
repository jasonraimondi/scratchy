import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "@/app/lib/use_auth";

export function useCheckAuth(to = "/app/dashboard") {
  const auth = useAuth();
  const router = useRouter();

  async function refreshAccessToken() {
    if (await auth.handleRefreshToken()) {
      await router.push(to);
    }
  }

  useEffect(() => void refreshAccessToken(), []);
}