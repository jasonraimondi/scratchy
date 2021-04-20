import React from "react";
import { useForm } from "react-hook-form";

import { Button, FormControl, Label } from "@/app/components/forms/elements";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { useCurrentUser } from "@/app/lib/use_current_user";
import { useNotify } from "use-notify-rxjs";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  currentPassword: yup.string().min(8).required(),
  password: yup.string().min(8).required(),
});

export function UpdatePasswordForm() {
  const { register, handleSubmit, formState, reset } = useForm({ mode: "onSubmit", resolver: yupResolver(schema) });

  const notify = useNotify();
  const currentUser = useCurrentUser();

  const handleUpdatePassword = async (formData: { currentPassword: string; password: string }) => {
    if (typeof currentUser.userId !== "string") {
      notify.error("currentUser.userId not found");
      return;
    }

    const input = {
      currentPassword: formData.currentPassword,
      password: formData.password,
      userId: currentUser.userId,
    };

    try {
      await graphQLSdk.UpdatePassword({ input });
      reset();
      notify.success({ title: "Password Updated", message: "It worked!" });
    } catch (err) {
      notify.error({ title: "Password Update Failure", message: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUpdatePassword)} data-test="update-password-form">
      <h1>Update Password</h1>
      <FormControl>
        <Label id="update-password-form--current-password">Current Password</Label>
        <input
          type="password"
          id="update-password-form--current-password"
          placeholder="******"
          {...register("currentPassword")}
        />
        {formState.errors.currentPassword && <span>{formState.errors.currentPassword.message}</span>}
      </FormControl>

      <FormControl>
        <Label id="update-password-form--password">New Password</Label>
        <input type="password" id="update-password-form--password" placeholder="******" {...register("password")} />
        {formState.errors.password && <span>{formState.errors.password.message}</span>}
      </FormControl>

      <Button data-test="update-password-form--submit">
        Submit
      </Button>
    </form>
  );
}
