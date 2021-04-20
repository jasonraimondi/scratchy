import React from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/app/lib/use_auth";
import { Button, FormControl, Label } from "@/app/components/forms/elements";
import { Link } from "@/app/components/links/link";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  rememberMe: yup.boolean().required(),
});

export function LoginForm() {
  const { register, handleSubmit, formState } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });

  const { login } = useAuth();

  return (
    <form onSubmit={handleSubmit(login)} data-test="login-form">
      <h1>Login</h1>
      <FormControl>
        <Label id="login-form--email">Email</Label>
        <input type="email" id="login-form--email" placeholder="john.doe@example.com" {...register("email")} />
        {formState.errors.email && <span>{formState.errors.email.message}</span>}
      </FormControl>

      <FormControl>
        <Label id="login-form--password">Password</Label>
        <input type="password" id="login-form--password" placeholder="******" {...register("password")} />
        <Link href="/forgot_password" data-test="forgot-password-link">
          <small>Forgot Password?</small>
        </Link>
        {formState.errors.password && <span>{formState.errors.password.message}</span>}
      </FormControl>

      <FormControl>
        <Label id="login-form--remember">Remember Me</Label>
        <input id="login-form--remember" type="checkbox" {...register("rememberMe")} />
        {formState.errors.rememberMe && <span>{formState.errors.rememberMe.message}</span>}
      </FormControl>

      <Button data-test="login-form--submit">Submit</Button>
    </form>
  );
}
