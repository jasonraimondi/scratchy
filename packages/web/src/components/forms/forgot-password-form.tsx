import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, FormControl, Label } from "@/app/components/forms/elements";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  firstName: yup.string(),
  lastName: yup.string(),
});

export function ForgotPasswordForm() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });

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
          {...register("email")}
          id="forgot-password-form--email"
          placeholder="john.doe@example.com"
        />
        {formState.errors.email && <p>{formState.errors.email.message}</p>}
      </FormControl>
      <Button data-test="forgot-password-form--submit" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
