import joi from "joi";

export const loginFormSchema = joi.object({
  email: joi.string().email({ tlds: false }).required(),
  password: joi.string().min(8).required(),
  rememberMe: joi.boolean().required(),
});

export const registerFormSchema = joi.object({
  email: joi.string().email({ tlds: false }).required(),
  password: joi.string().min(8).required(),
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
});

