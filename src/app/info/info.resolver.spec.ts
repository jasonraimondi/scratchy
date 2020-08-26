import { AppResolver } from "./info.resolver";
import pkg from "../../../package.json";

describe("app_resolver", () => {
  test("info info from package.json is resolved correctly", async () => {
    const appResolver = new AppResolver();

    const { version, name, license } = appResolver.info();

    expect(version).toBe(pkg.version);
    expect(name).toBe(pkg.name);
    expect(license).toBe(pkg.license);
  });
});
