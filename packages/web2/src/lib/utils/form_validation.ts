import { ObjectSchema, ValidationError } from "joi";

type FormData = { schema: ObjectSchema; data: any; };

export async function validateForm({ schema, data }: FormData) {
  let formErrors: Record<string, string>;

  try {
    await schema.validateAsync(data, { abortEarly: false });
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log({...err})
      formErrors = err.details.reduce((acc, err) => ({ ...acc, [err.context.key]: err.message }), {});
    }
  }
  return formErrors;
}
