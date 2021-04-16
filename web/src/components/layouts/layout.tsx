import classnames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo } from "react";

import { Notify } from "@/app/components/layouts/partials/notify";
import { Header } from "@/app/components/layouts/partials/header";
import { useAuth } from "@/app/lib/use_auth";
import { DebugBar } from "@/app/components/debug/debug";

import el from "./layout.module.css";
import { notifyService } from "use-notify-rxjs";

export const Layout: FC<{ title?: string; isPrivate?: boolean }> = ({
  children,
  title = "Scratchy Title",
  isPrivate = false,
}) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => void checkAuth(), []);

  const isExpired = useMemo(() => !auth.isAuthenticated(), [auth.accessToken]);

  async function checkAuth() {
    if (isPrivate && isExpired) {
      notifyService.info("is private and is expired, running token refresh");
      // this line is racing against the useMe query line
      if (await auth.handleRefreshToken()) {
        notifyService.info("It refreshed successfully");
      } else {
        await router.push("/login");
      }
    }
  }

  let body;

  if (isPrivate && isExpired) {
    console.log("unauthorized");
    body = <p>Unauthorized</p>;
  } else {
    body = children;
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>{title}</title>
      </Head>
      <div>
        <Header />
        <Notify />
        <main className={classnames("container padded center", el.main)}>{body}</main>
        {process.env.NODE_ENV === "development" && <DebugBar />}
      </div>
    </>
  );
};
