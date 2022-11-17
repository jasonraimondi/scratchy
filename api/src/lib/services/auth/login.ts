import { z } from "zod";

export const CredentialsLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});
export type CredentialsLoginSchema = z.infer<typeof CredentialsLoginSchema>;
export const UserLoginSchema = z.object({
  user: z.any(),
  rememberMe: z.boolean().optional(),
});
export type UserLoginSchema = z.infer<typeof UserLoginSchema>;
export const LoginSchema = z.union([CredentialsLoginSchema, UserLoginSchema]);
export type LoginSchema = z.infer<typeof LoginSchema>;
export const LoginSchemaWithIP = LoginSchema.and(
  z.object({
    ipAddr: z.string(),
  }),
);
export type LoginSchemaWithIP = z.infer<typeof LoginSchemaWithIP>;
