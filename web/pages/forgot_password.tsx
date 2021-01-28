import { useRouter } from "next/router";
import React, { useState } from "react";

import { Layout } from "@/app/components/layouts/layout";
import { ForgotPasswordFormData } from "@/app/components/forms/forgot_password_form";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, Label } from "@/app/components/forms/elements";
import { useForm } from "react-hook-form";
import { validEmail } from "./register";


export default function ForgotPassword() {
  const router = useRouter();

  const { register, handleSubmit, errors } = useForm();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await graphQLSdk.SendForgotPasswordEmail({ email: data.email });
    await router.push("/");
    setSubmitting(false);
  };

  return (
    <Layout title="Login Page">
      <h1 className="h5">Forgot Password Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} data-test="forgot-password-form">
        <Label data-test="forgot-password-form--email">
          <span>Email</span>
          <input type="email" name="email" placeholder="john.doe@example.com" ref={register({ required: true, pattern: validEmail })} />
          {errors.email}
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          <span>Submit</span>
        </Button>
      </form>
    </Layout>
  );
};
