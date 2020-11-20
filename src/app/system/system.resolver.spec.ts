import { SystemResolver } from "~/app/system/system.resolver";

import pkg from "../../../package.json";

describe(SystemResolver, () => {
  test("info info from package.json is resolved correctly", async () => {
    const appResolver = new SystemResolver();

    const { version, name, license } = appResolver.info();

    expect(version).toBe(pkg.version);
    expect(name).toBe(pkg.name);
    expect(license).toBe(pkg.license);
  });
});
