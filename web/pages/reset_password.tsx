import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Layout } from "@/app/components/layouts/layout";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, Label } from "@/app/components/forms/elements";

export default function ForgotPassword({ email, token }: Record<string, string | null>) {
  if (!email || !token) {
    return (
      <p>
        Missing Token {email} {token} 1 2 3 4
      </p>
    );
  }

  const { register, handleSubmit, errors } = useForm();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    await graphQLSdk.ValidateForgotPasswordToken({ token, email });
    await graphQLSdk.UpdatePasswordFromToken({ data });
    setSubmitting(false);
  };

  return (
    <Layout title="Reset Password">
      <h1 className="h5">Reset Password Page</h1>

      <form onSubmit={handleSubmit(onSubmit)} data-test="reset-password-form">
        <Label data-test="reset-password-form--password">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="enter a secure password"
            ref={register({ required: true, minLength: 8 })}
          />
          {errors.password}
        </Label>
        <Button data-test="reset-password-form--submit" type="submit" disabled={isSubmitting}>
          <span>Submit</span>
        </Button>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      email: ctx.query.e ?? null,
      token: ctx.query.u ?? null,
    },
  };
};
