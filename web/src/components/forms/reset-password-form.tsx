import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { Button, FormControl, Label } from "@/app/components/forms/elements";
import { useRouter } from "next/router";
import { useNotify } from "use-notify-rxjs";

type ResetPasswordFormData = { password: string };

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const { register, handleSubmit, formState } = useForm();
  const router = useRouter();
  const notify = useNotify();

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (foo: ResetPasswordFormData) => {
    await graphQLSdk.ValidateForgotPasswordToken({ data: { token, email } });
    const { data, errors } = await graphQLSdk.UpdatePasswordFromToken({
      data: { password: foo.password, token, email },
    });

    if (!errors && data) {
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
        {formState.errors.password}
        <input
          type="password"
          id="reset-password-form--password"
          placeholder="enter a secure password"
          {...register("password", { required: true, minLength: 8 })}
        />
      </FormControl>

      <Button data-test="reset-password-form--submit" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
