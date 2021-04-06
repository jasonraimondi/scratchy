import React from "react";

import { Layout } from "@/app/components/layouts/layout";

import { LoginForm } from "@/app/components/forms/login-form";

export default function LoginPage() {
  return (
    <Layout title="Login">
      <div className="centered-form">
        <LoginForm />
      </div>
    </Layout>
  );
}
