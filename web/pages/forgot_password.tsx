import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Label } from "@/app/components/forms/elements";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Layout } from "@/app/components/layouts/layout";
import { validEmail } from "./register";

export default function ForgotPassword() {
  const router = useRouter();

  const { register, handleSubmit, errors } = useForm();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    await graphQLSdk.SendForgotPasswordEmail({ email: data.email });
    await router.push("/");
    setSubmitting(false);
  };

  return (
    <Layout title="Login Page">
      <h1>Forgot Password Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} data-test="forgot-password-form">
        <Label data-test="forgot-password-form--email">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            ref={register({ required: true, pattern: validEmail })}
          />
          {errors.email}
        </Label>
        <Button data-test="forgot-password-form--submit" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Layout>
  );
}
