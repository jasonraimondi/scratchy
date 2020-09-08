import { route } from "~/lib/serviced/route";

test("route_helper", () => {
  const myRoute = route("/photo/:photoId");

  const template = myRoute.template;
  const createdRoute = myRoute.create({ photoId: 123 });

  expect(template).toBe("localhost/photo/:photoId");
  expect(createdRoute).toBe("localhost/photo/123");
});
