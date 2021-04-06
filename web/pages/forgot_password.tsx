import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { ForgotPasswordForm } from "@/app/components/forms/forgot-password-form";

export default function ForgotPassword() {
  return (
    <Layout title="Forgot Password">
      <div className="centered-form">
        <ForgotPasswordForm />
      </div>
    </Layout>
  );
}
