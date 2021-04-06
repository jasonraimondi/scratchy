import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, FormControl, Label } from "@/app/components/forms/elements";
import { validEmailRegex } from "@/app/components/forms/forgot-password-form";

export type RegisterFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export function RegisterForm() {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm();

  const [status, setStatus] = useState<string>();
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    try {
      await graphQLSdk.Register({ data });
      setSubmitting(false);
      await router.push("/register/success");
    } catch (e) {
      setStatus(e.message);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-test="register-form">
      <h1>Register</h1>
      {status && <span className="bg-red-500 text-white text-center px-6 py-1 my-2 rounded">{status}</span>}
      <FormControl>
        <Label id="register-form--email">Email</Label>
        <input
          type="email"
          id="register-form--email"
          placeholder="john.doe@example.com"
          {...register("email", { required: true, pattern: validEmailRegex })}
        />
        {formState.errors.email && <span>{formState.errors.email}</span>}
      </FormControl>

      <FormControl>
        <Label id="register-form--password">Password</Label>
        <input
          type="password"
          id="register-form--password"
          placeholder="**************"
          {...register("password", { required: true })}
        />
        {formState.errors.password && <span>{formState.errors.password}</span>}
      </FormControl>

      <FormControl>
        <Label id="register-form--first">First Name</Label>
        <input
          type="text"
          id="register-form--first"
          placeholder="John"
          {...register("firstName", { required: true })}
        />
        {formState.errors.firstName && <span>{formState.errors.firstName}</span>}
      </FormControl>

      <FormControl>
        <Label id="register-form--last">Last Name</Label>
        <input type="text" id="register-form--last" placeholder="Doe" {...register("lastName", { required: true })} />
        {formState.errors.lastName && <span>{formState.errors.lastName}</span>}
      </FormControl>

      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
