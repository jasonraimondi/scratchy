import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { LoginForm } from "@/app/components/forms/login-form";
import { useCheckAuth } from "@/app/lib/use_check_auth";

export default function LoginPage() {
  useCheckAuth();

  return (
    <Layout title="Login">
      <div className="centered-form">
        <LoginForm />
      </div>
    </Layout>
  );
}
