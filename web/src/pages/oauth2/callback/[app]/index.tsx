import { useRouter } from "next/router";
import { useEffect } from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/use_auth";

export default function CatchPage() {
  const router = useRouter();
  const { handleCodeTokenExchange } = useAuth();
  const { code, state } = router.query;

  const handleToken = async () => {
    const isSuccessful = await handleCodeTokenExchange(String(code), String(state)).catch(e => {
      console.log(e);
      return false;
    });

    if (isSuccessful) {
      await router.replace("/app/dashboard");
    } else {
      await router.replace("/?message=something_went_wrong")
    }
  }

  useEffect(() => {
    if (code && state) handleToken();
  }, [code, state]);

  return <Layout title="Redirecting">
    <p>Redirecting...</p>
  </Layout>
}