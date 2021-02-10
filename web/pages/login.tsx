import React from "react";
import { useForm } from "react-hook-form";

import { Layout } from "@/app/components/layouts/layout";
import { Button, Label } from "@/app/components/forms/elements";
import { Link } from "@/app/components/links/link";
import { useAuth } from "@/app/lib/use_auth";

export default function LoginPage() {
  const { register, handleSubmit, errors } = useForm();

  const { handleLogin, handleRefreshToken } = useAuth();

  return (
    <Layout title="Login">
      <form
        onSubmit={handleSubmit(handleLogin)}
        data-test="reset-password-form"
        className="bg-gray-200 p-2 m-2 rounded"
      >
        <Label data-test="email">
          <span>Email</span>
          <input type="email" name="email" placeholder="john.doe@example.com" ref={register} />
          {errors.emailError && <span>ERROR</span>}
        </Label>
        <Label data-test="password">
          <span>Password</span>
          <input type="password" name="password" placeholder="******" ref={register} />
          <br />
          <Link href="/forgot_password">
            <a data-test="forgot-password-link" className="small">
              Forgot Password?
            </a>
          </Link>
          {errors.passwordError && <span>ERROR</span>}
        </Label>
        <Label data-test="remember-me">
          <input name="rememberMe" type="checkbox" ref={register} />
          <span className="inline">Remember Me</span>
          {errors.rememberMe && <span>ERROR</span>}
        </Label>
        <Button data-test="submit">
          <span>Submit</span>
        </Button>
      </form>
      <div>
        <button data-test="refresh-token" onClick={() => void handleRefreshToken()}>
          Test reload token
        </button>
      </div>
    </Layout>
  );
}
