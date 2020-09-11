import { InfoResolver } from "~/app/info/info.resolver";

import pkg from "../../../package.json";

describe("info resolver", () => {
  test("info info from package.json is resolved correctly", async () => {
    const appResolver = new InfoResolver();

    const { version, name, license } = appResolver.info();

    expect(version).toBe(pkg.version);
    expect(name).toBe(pkg.name);
    expect(license).toBe(pkg.license);
  });
});
