import { useAuth } from "@/app/lib/use_auth";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Layout } from "@/app/components/layouts/layout";
import { ResetPasswordFormData } from "@/app/components/forms/reset_password_form";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, Label } from "@/app/components/forms/elements";

const ResetPasswordForm = dynamic(() => import("@/app/components/forms/reset_password_form"), { ssr: false });

export default function ResetPassword() {
  const { handleLoginRedirect } = useAuth();
  const router = useRouter();
  const { e, u } = router.query;
  const [email] = useState(Array.isArray(e) ? e[0] : e);
  const [token] = useState(Array.isArray(u) ? u[0] : u);

  if (!email || !token) {
    return <p>Missing Token</p>;
  }

  const { register, handleSubmit, errors } = useForm();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ResetPasswordFormData) => {
    await graphQLSdk.ValidateForgotPasswordToken({ token, email });
    await graphQLSdk.UpdatePasswordFromToken({ data });
    setSubmitting(false);
    await handleLoginRedirect();
  };

  return (
    <Layout title="Reset Password">
      <h1 className="h5">Reset Password Page</h1>
      <ResetPasswordForm token={token} email={email} handleSubmit={handleSubmit} />

      <form onSubmit={handleSubmit(onSubmit)} data-test="reset-password-form">
        <Label data-test="reset-password-form--password">
          <span>Password</span>
          <input type="password" name="password" placeholder="enter a secure password" ref={register({ required: true, minLength: 8 })}/>
          {errors.password}
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          <span>Submit</span>
        </Button>
      </form>
    </Layout>
  );
};