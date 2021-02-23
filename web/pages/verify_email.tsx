import { Layout } from "@/app/components/layouts/layout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { useNotify } from "use-notify-rxjs";

export default function VerifyEmail() {
  const router = useRouter();
  const { e, u } = router.query;
  const email = Array.isArray(e) ? e[0] : e;
  const id = Array.isArray(u) ? u[0] : u;

  const verifyEmailData: any = { email, id };
  const [status, setStatus] = useState("Verifying Email...");
  const notify = useNotify();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleVerifyUser = async () => {
    if (!email || !id) {
      notify.error("missing email or id");
      return;
    }
    await graphQLSdk.VerifyEmailConfirmation({ data: verifyEmailData }).catch((e: any) => {
      setStatus(e.message);
      notify.error(e.message);
    });
    setStatus("Success! Redirecting to login...");
    await sleep(750);
    // await router.push("/login");
  };

  useEffect(() => {
    handleVerifyUser().catch((e) => console.error(e));
  }, []);

  return (
    <Layout title="Verify Email">
      <h1 className="h5">{status}</h1>
    </Layout>
  );
}
