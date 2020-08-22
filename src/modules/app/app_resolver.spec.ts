import { AppResolver } from "./app_resolver";
import pkg from "../../../package.json";

describe("app_resolver", () => {
  test("version is resolved correctly", () => {
    const appResolver = new AppResolver();

    const { version, name, license } = appResolver.info();

    expect(version).toBe(pkg.version);
    expect(name).toBe(pkg.name);
    expect(license).toBe(pkg.license);
  });
});
