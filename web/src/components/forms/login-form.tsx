import React from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/app/lib/use_auth";
import { Button, FormControl, Label } from "@/app/components/forms/elements";
import { Link } from "@/app/components/links/link";

export function LoginForm() {
  const { register, handleSubmit, formState } = useForm({ mode: "onChange" });

  const { handleLogin } = useAuth();

  return (
    <form onSubmit={handleSubmit(handleLogin)} data-test="login-form">
      <h1>Login</h1>
      <FormControl>
        <Label id="login-form--email">Email</Label>
        <input
          type="email"
          id="login-form--email"
          placeholder="john.doe@example.com"
          {...register("email", { required: true })}
        />
        {formState.errors.emailError && <span>ERROR</span>}
      </FormControl>

      <FormControl>
        <Label id="login-form--password">Password</Label>
        <input
          type="password"
          id="login-form--password"
          placeholder="******"
          {...register("password", { required: true })}
        />
        <Link href="/forgot_password" data-test="forgot-password-link">
          <small>Forgot Password?</small>
        </Link>
        {formState.errors.passwordError && <span>ERROR</span>}
      </FormControl>

      <FormControl>
        <Label id="login-form--remember">Remember Me</Label>
        <input id="login-form--remember" type="checkbox" {...register("rememberMe")} />
        {formState.errors.rememberMe && <span>ERROR</span>}
      </FormControl>

      <Button data-test="login-form--submit" disabled={formState.isDirty && !formState.isValid}>
        Submit
      </Button>
    </form>
  );
}
