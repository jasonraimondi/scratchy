import React from "react";
import { useForm } from "react-hook-form";

import { Layout } from "@/app/components/layouts/layout";
import { Button, Label } from "@/app/components/forms/elements";
import { Link } from "@/app/components/links/link";
import { useAuth } from "@/app/lib/use_auth";

import el from "./login.module.css";

export default function LoginPage() {
  const { register, handleSubmit, errors } = useForm();

  const { handleLogin } = useAuth();

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(handleLogin)} data-test="login-form" className="bg-gray-200 p-2 m-2 rounded">
        <Label data-test="email">
          <span>Email</span>
          <input type="email" name="email" placeholder="john.doe@example.com" ref={register} />
          {errors.emailError && <span>ERROR</span>}
        </Label>
        <Label data-test="password">
          <span>Password</span>
          <input type="password" name="password" placeholder="******" ref={register} />
          <br />
          <Link href="/forgot_password" data-test="forgot-password-link">
            <small>Forgot Password?</small>
          </Link>
          {errors.passwordError && <span>ERROR</span>}
        </Label>
        <Label data-test="remember-me">
          <input name="rememberMe" type="checkbox" ref={register} />
          <span>Remember Me</span>
          {errors.rememberMe && <span>ERROR</span>}
        </Label>
        <Button data-test="submit" className={el.button}>
          Submit
        </Button>
      </form>
    </Layout>
  );
}
