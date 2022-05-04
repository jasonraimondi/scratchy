import joi from "joi";
import { createForm } from "@jmondi/form-validator";
import { BookStatus } from "@modules/web-api-client/src/generated/graphql";

const email = joi.string().email({ tlds: false });
const password = joi.string().min(8);
const uuidv4 = joi.string().invalid("").uuid({ version: "uuidv4" });

export const updatePasswordFromTokenSchema = createForm({
  email: email.required(),
  password: password.required(),
  token: uuidv4.required(),
});

export const emailConfirmationSchema = createForm({
  email: email.required(),
  token: uuidv4.required(),
});

const validMimeTypes = ["image/png", "image/jpg"];
const validUploadTypes = ["avatar"];

// prettier-ignore
export const fileUploadSchema = createForm({
	fileName: joi.required(),
	mimeType: joi.string().valid(...validMimeTypes).required(),
	type: joi.string().valid(...validUploadTypes).required()
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
  nickname: joi.string().allow(null).optional(),
});

export const createBookSchema = createForm({
  id: uuidv4,
  title: joi.string().required(),
  subtitle: joi.string(),
  status: joi
    .string()
    .valid(...Object.values(BookStatus))
    .required(),
  userId: uuidv4.required(),
  isPrivate: joi.boolean().required(),
});

export const createChapterSchema = createForm({
  id: uuidv4,
  content: joi.string().invalid("").required(),
  userId: uuidv4.required(),
  bookId: uuidv4.required(),
});
