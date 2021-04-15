import React, { useEffect } from "react";

import { Layout } from "@/app/components/layouts/layout";

import { LoginForm } from "@/app/components/forms/login-form";
import { useAuth } from "@/app/lib/use_auth";
import { useRouter } from "next/router";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();

  async function refreshAccessToken() {
    if (await auth.handleRefreshToken()) {
      await router.push("/app/dashboard");
    }
  }

  useEffect(() => void refreshAccessToken(), []);

  return (
    <Layout title="Login">
      <div className="centered-form">
        <LoginForm />
      </div>
    </Layout>
  );
}
