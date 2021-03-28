import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as React from "react";
import { useNotify } from "use-notify-rxjs";

import { Notify } from "@/app/components/layouts/notify";
import { Header } from "@/app/components/layouts/partials/header";
import { useAuth } from "@/app/lib/use_auth";
import { Button } from "@/app/components/forms/elements";

export const Layout: React.FC<{ title?: string; isPrivate?: boolean }> = ({
  children,
  title = "Scratchy Title",
  isPrivate = false,
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isPrivate && !isAuthenticated()) router.push("/register");
  }, []);

  const { info, error, success } = useNotify();

  let body;

  if (isPrivate && typeof window === "undefined") {
    body = <p>JASON Template is loading...</p>;
  } else {
    body = children;
  }

  return (
    <React.StrictMode>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/*<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>*/}
        {/*<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>*/}
        {/*<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>*/}
        {/*<link rel="manifest" href="/site.webmanifest"/>*/}
      </Head>
      <main className="container padded center">
        <Header />
        <Notify />
        <div>{body}</div>
      </main>
      <div>
        <Button onClick={() => info("hi ya slugger!")} style={{ backgroundColor: "var(--colors-teal-500)"}}>Notify Info</Button>
        <Button onClick={() => error("heads up slugger!")} style={{ backgroundColor: "var(--colors-red-500)"}}>Notify Error</Button>
        <Button onClick={() => success("great job slugger!")} style={{ backgroundColor: "var(--colors-green-500)"}}>Notify Success</Button>
      </div>
    </React.StrictMode>
  );
};
