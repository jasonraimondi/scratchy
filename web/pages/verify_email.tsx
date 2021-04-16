import { Layout } from "@/app/components/layouts/layout";
import React, { useEffect, useState } from "react";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { useNotify } from "use-notify-rxjs";
import type { GetServerSideProps } from "next";
import { sleep } from "@/app/lib/utils/sleep";
import { useRouter } from "next/router";

type Props = { email: string; uuid: string };

export default function VerifyEmail(data: Props) {
  const [status, setStatus] = useState("Verifying Email...");
  const notify = useNotify();
  const router = useRouter();

  const handleVerifyUser = async () => {
    try {
      const foo = await graphQLSdk.VerifyEmailConfirmation({ data });
      notify.success("HI JASON");
      console.log({ foo });
      setStatus("Success! Redirecting to login...");
      await sleep(750);
      await router.push("/login");
    } catch (err) {
      setStatus(err.message);
      notify.error(err.message);
    }
  };

  useEffect(() => void handleVerifyUser(), []);

  return (
    <Layout title="Verify Email">
      <h1 className="h5">{status}</h1>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { query, res } = ctx;

  if (typeof query.e !== "string" || typeof query.u !== "string") {
    res.statusCode = 302;
    res.setHeader("Location", "/login"); // Replace <link> with your url link
    return { props: {} };
  }

  return {
    props: {
      email: ctx.query.e,
      uuid: ctx.query.u,
    },
  };
};
