import joi from "joi";
import { createForm } from "$lib/utils/form_validation";

const email = joi.string().email({ tlds: false });
const password = joi.string().min(8);

export const forgotPasswordForm = createForm({
  email: email.required(),
});

export const loginFormSchema = createForm({
  email: email.required(),
  password: password.required(),
  rememberMe: joi.boolean().required(),
});

export const registerFormSchema = createForm({
  email: email.required(),
  password: password.required(),
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
});

