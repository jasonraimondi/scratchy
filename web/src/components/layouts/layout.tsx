import classnames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as React from "react";
import { useNotify } from "use-notify-rxjs";

import { Notify } from "@/app/components/layouts/partials/notify";
import { Header } from "@/app/components/layouts/partials/header";
import { useAuth } from "@/app/lib/use_auth";
import { DebugBar } from "@/app/components/debug/debug";

import el from "./layout.module.css";

export const Layout: React.FC<{ title?: string; isPrivate?: boolean }> = ({
  children,
  title = "Scratchy Title",
  isPrivate = false,
}) => {
  const auth = useAuth();
  const router = useRouter();
  const notify = useNotify();

  useEffect(() => {
    if (isPrivate && !auth.isAuthenticated()) {
      notify.error({ title: "Access Forbidden", message: "Log in to access that page." });
      router.push("/login");
    }
  }, []);

  let body;

  if (isPrivate && typeof window === "undefined") {
    body = <p>Template is loading...</p>;
  } else {
    body = children;
  }

  return (
    <React.StrictMode>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Notify />
      <main className={classnames("container padded center", el.main)}>{body}</main>
      {process.env.NODE_ENV === "development" && <DebugBar />}
    </React.StrictMode>
  );
};
