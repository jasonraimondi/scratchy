import { generateRandomToken } from "~/lib/random_token";

it("random generates a string", async () => {
  const token = await generateRandomToken();
  expect(token.length).toBe(80);
});
