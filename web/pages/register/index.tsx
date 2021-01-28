import { useRouter } from "next/router";
import React, { useState } from "react";

import { Layout } from "@/app/components/layouts/layout";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, Label } from "@/app/components/forms/elements";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegisterFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

import { useForm } from "react-hook-form";

export default function Register() {
  const router = useRouter();

  const { register, handleSubmit, errors } = useForm();

  const [status, setStatus] = useState<string>();
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    try {
      await graphQLSdk.Register({ data });
      setSubmitting(false);
      await router.push("/register/success")
    } catch (e) {
      setStatus(e.message);
    }
    setSubmitting(false);
  };

  return (
    <Layout title="Register Page">
      <h1>Register Page</h1>

      <form onSubmit={handleSubmit(onSubmit)} data-test="register-form">
        {status && <span className="bg-red-500 text-white text-center px-6 py-1 my-2 rounded">{status}</span>}
        <Label data-test="register-form--email">
          <span>Email</span>
          <input type="email" name="email" placeholder="john.doe@example.com" ref={register({ required: true, pattern: validEmail})}/>
          {errors.email && <span>{errors.email}</span>}
        </Label>
        <Label data-test="register-form--password">
          <span>Password</span>
          <input type="password" name="password" placeholder="**************" ref={register}/>
          {errors.password && <span>{errors.password}</span>}
        </Label>
        <Label data-test="register-form--first">
          <span>First Name</span>
          <input type="text" name="firstName" placeholder="John" ref={register}/>
          {errors.firstName && <span>{errors.firstName}</span>}
        </Label>
        <Label data-test="register-form--last">
          <span>Last Name</span>
          <input type="text" name="lastName" placeholder="Doe" ref={register}/>
          {errors.lastName && <span>{errors.lastName}</span>}
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Layout>
  );
};
