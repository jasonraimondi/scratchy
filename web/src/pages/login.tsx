// import { useRouter } from "next/router";
import { useEffect } from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/use_auth";

export default function LoginPage() {
  const { isAuthenticated, handleLoginRedirect } = useAuth();
  // const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      // router.replace("/app/dashboard?message=access-token-is-still-valid")
    } else {
      handleLoginRedirect();
    }
  }, []);

  return <Layout title="Login">
    <p>Redirecting...</p>
  </Layout>;
}
