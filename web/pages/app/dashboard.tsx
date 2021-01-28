import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/use_auth";
import React from "react";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  let body;

  if (!isAuthenticated()) {
    body = <p>Invalid Token</p>;
  } else {
    body = <ul>
      <li>IS AUTHENTICATED YES</li>
    </ul>;
  }

  return <Layout title="I am the dashboard" isPrivate={true}>
    {body}
  </Layout>;
};