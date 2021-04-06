import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { RegisterForm } from "@/app/components/forms/register-form";

export default function Register() {
  return (
    <Layout title="Register">
      <div className="centered-form">
        <RegisterForm />
      </div>
    </Layout>
  );
}
