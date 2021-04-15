import { route } from "~/lib/util/route";

test("route generation", () => {
  const myRoute = route("/photo/:photoId");

  expect(myRoute.template).toBe("http://localhost/photo/:photoId");
  expect(myRoute.create({ photoId: 123 })).toBe("http://localhost/photo/123");
});
