import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { RegisterForm } from "@/app/components/forms/register-form";
import { useCheckAuth } from "@/app/lib/use_check_auth";

export default function Register() {
  useCheckAuth();

  return (
    <Layout title="Register">
      <div className="centered-form">
        <RegisterForm />
      </div>
    </Layout>
  );
}
