import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, FormControl, Label } from "@/app/components/forms/elements";
import { useRouter } from "next/router";
import { useNotify } from "use-notify-rxjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type ResetPasswordFormData = { password: string };

const schema = yup.object().shape({
  password: yup.string().min(8).required(),
});

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const { register, handleSubmit, formState } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });
  const router = useRouter();
  const notify = useNotify();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (input: ResetPasswordFormData) => {
    await graphQLSdk.ValidateForgotPasswordToken({ input: { token, email } });
    const data = await graphQLSdk.UpdatePasswordFromToken({
      input: { password: input.password, token, email },
    });

    if (data) {
      const { accessToken, user } = data.updatePasswordFromToken;
      notify.info(accessToken);
      notify.info(user.email);
    }

    notify.info("We should auto login the user here");
    setSubmitting(false);
    await router.replace("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-test="reset-password-form">
      <h1>Reset Password</h1>

      <FormControl>
        <Label id="reset-password-form--password">Password</Label>
        <input
          type="password"
          id="reset-password-form--password"
          placeholder="enter a secure password"
          {...register("password")}
        />
        {formState.errors.password && <span>{formState.errors.password.message}</span>}
      </FormControl>

      <Button data-test="reset-password-form--submit" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
