import { Header } from "@/app/components/layouts/partials/header";
import { useAuth } from "@/app/lib/use_auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as React from "react";

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
      <main>
        <Header />
        <div>{body}</div>
      </main>
    </React.StrictMode>
  );
};
