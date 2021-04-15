import { base64decode, base64encode } from "~/lib/util/base64";

describe("base64 helper", () => {
  const encoded = "amFzb25yYWltb25kaQ==";
  const decoded = "jasonraimondi";

  test("encoding", () => {
    expect(base64encode(decoded)).toBe(encoded);
  });

  test("decoding", () => {
    expect(base64decode(encoded)).toBe(decoded);
  });
});
