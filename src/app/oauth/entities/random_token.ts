import crypto from "crypto";

export function generateRandomToken() {
  return crypto.randomBytes(40).toString("hex");
}
