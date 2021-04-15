import { Layout } from "@/app/components/layouts/layout";
import React, { useEffect, useState } from "react";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { useNotify } from "use-notify-rxjs";
import type { GetServerSideProps } from "next";
import { sleep } from "@/app/lib/utils/sleep";

export default function VerifyEmail({ email, id }: Record<string, unknown>) {
  const verifyEmailData: any = { email, id };
  const [status, setStatus] = useState("Verifying Email...");
  const notify = useNotify();

  const handleVerifyUser = async () => {
    if (!email || !id) {
      console.log({ email, id });
      notify.error({ message: "missing email or id" + JSON.stringify({ email, id }), ttl: 50000 });
      return;
    }
    const foo = await graphQLSdk.VerifyEmailConfirmation({ data: verifyEmailData }).catch((e: any) => {
      setStatus(e.message);
      notify.error(e.message);
    });
    notify.success("HI JASON");
    console.log({ foo });
    setStatus("Success! Redirecting to login...");
    await sleep(750);
    // await router.push("/login");
  };

  useEffect(() => {
    handleVerifyUser().catch(e => console.error(e));
  }, []);

  return (
    <Layout title="Verify Email">
      <h1 className="h5">{status}</h1>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      email: ctx.query.e ?? null,
      id: ctx.query.u ?? null,
    },
  };
};
