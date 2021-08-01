import joi from "joi";
import { writable } from "svelte/store";

export const loginFormState = writable({
  email: "",
  password: "",
  rememberMe: true,
});

export const loginFormSchema = joi.object({
  email: joi.string().email({ tlds: false }).required(),
  password: joi.string().min(8).required(),
  rememberMe: joi.boolean().required(),
});
