import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "@/app/lib/use_auth";

export function useCheckAuth(to = "/app/dashboard") {
  const { refreshToken } = useAuth();
  const router = useRouter();

  async function refreshAccessToken() {
    if (await refreshToken()) {
      await router.push(to);
    }
  }

  useEffect(() => void refreshAccessToken(), []);
}
