import joi from "joi";
import { createForm } from "@jmondi/form-validator";

const email = joi.string().email({ tlds: false });
const password = joi.string().min(8);

export const updatePasswordFromTokenSchema = createForm({
  email: email.required(),
  password: password.required(),
  token: joi.string().uuid({ version: "uuidv4" }).required(),
});

export const forgotPasswordSchema = createForm({
  email: email.required(),
});

export const loginSchema = createForm({
  email: email.required(),
  password: password.required(),
  rememberMe: joi.boolean().required(),
});

export const registerSchema = createForm({
  email: email.required(),
  password: password.required(),
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
});

