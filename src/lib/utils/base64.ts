export function base64encode(str: string) {
  return Buffer.from(str).toString("base64");
}

export function base64decode(str: string) {
  return Buffer.from(str, "base64").toString("binary");
}
