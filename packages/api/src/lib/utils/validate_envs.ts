import { validate, ValidationError } from "class-validator";

import { ENV } from "~/config/environment";

export async function validateEnv() {
  const validationErrors = await validate(ENV);
  if (validationErrors.length === 0) return;

  // -------------------------------------------------------
  // This is ridiculous, it is just formatting the error
  // messages into a nicer output, if anything goes wrong,
  // just delete it.
  // -------------------------------------------------------
  const errors = validationErrors
    .reduce((prev, next) => {
      const result = [...prev];
      if (next.children?.length) result.push(...next.children);
      return [next, ...result];
    }, [] as ValidationError[])
    .map((e) => {
      if (!e.constraints) return undefined;
      return Object.values(e.constraints).map((v) => {
        const [first, ...split] = v.split(" ");
        const result = [`"${first}"`, ...split].join(" ");
        return `** ${e.target?.constructor.name} ${result} **`;
      });
    })
    .filter((e) => e !== undefined);

  throw new Error(`Invalid Environment \n\n${errors.join("\n- ")}\n`);
}