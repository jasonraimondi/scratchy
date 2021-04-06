import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, FormControl, Label } from "@/app/components/forms/elements";

export const validEmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    await graphQLSdk.SendForgotPasswordEmail({ email: data.email });
    await router.push("/");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-test="forgot-password-form">
      <h1>Forgot Password?</h1>
      <FormControl>
        <Label id="forgot-password-form--email">Email</Label>
        <input
          type="email"
          {...register("email", { required: true, pattern: validEmailRegex })}
          id="forgot-password-form--email"
          placeholder="john.doe@example.com"
        />
        {errors.email}
      </FormControl>
      <Button data-test="forgot-password-form--submit" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
