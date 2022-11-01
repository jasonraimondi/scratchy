import { z } from "zod";

const email = z.string().email();
const password = z.string().min(8);
const uuidv4 = z.string().uuid();

export const updatePasswordFromTokenSchema = z.object({
  email: email,
  password: password,
  token: uuidv4,
});

export const emailConfirmationSchema = z.object({
  email: email,
  token: uuidv4,
});

// prettier-ignore
export const fileUploadSchema = z.object({
	fileName: z.string(),
	mimeType: z.enum(["image/png", "image/jpg"]),
	type: z.enum(["avatar"]),
});

export const forgotPasswordSchema = z.object({
  email: email,
});

export const loginSchema = z.object({
  email: email,
  password: password,
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  email: email,
  password: password,
  nickname: z.string().optional(),
});
