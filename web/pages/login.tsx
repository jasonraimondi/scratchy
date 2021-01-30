import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Layout } from "@/app/components/layouts/layout";
import { Button, Label } from "@/app/components/forms/elements";
import { Link } from "@/app/components/links/link";
import { httpClient } from "@/app/lib/http_client";

export default function LoginPage() {
  const { register, handleSubmit, errors } = useForm();
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    console.log(data);
    await httpClient("http://localhost:3001/auth/login", {
      body: {
        username: data.email,
        password: data.password,
      }
    }).then(({ accessToken }) => {
      console.log(accessToken);
    })
    setSubmitting(false);
  }

  return <Layout title="Login">
    <form onSubmit={handleSubmit(onSubmit)} data-test="reset-password-form" className="bg-gray-200">
      <Label data-test="login-form--email">
        <span>Email</span>
        <input type="email" defaultValue="jason@raimondi.us"  name="email" placeholder="john.doe@example.com" ref={register} />
        {errors.emailError && <span>ERROR</span>}
      </Label>
      <Label data-test="login-form--password">
        <span>Password</span>
        <input type="password" defaultValue="jasonraimondi" name="password" placeholder="******" ref={register} />
        <br />
        <Link href="/forgot_password">
          <a data-test="forgot-password-link" className="small">
            Forgot Password?
          </a>
        </Link>
        {errors.passwordError && <span>ERROR</span>}
      </Label>
      <Label data-test="login-form--remember-me">
        <input name="rememberMe" type="checkbox" ref={register} />
        <span className="inline">Remember Me</span>
        {errors.rememberMe && <span>ERROR</span>}
      </Label>
      <Button type="submit" disabled={isSubmitting}>
        <span>Submit</span>
      </Button>
    </form>
  </Layout>;
}
