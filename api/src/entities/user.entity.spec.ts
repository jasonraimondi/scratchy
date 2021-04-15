import { generateUser } from "~test/generators/generateUser";

describe("user entity", () => {
  test("isActive computed correctly", async () => {
    const user1 = await generateUser({ email: "charlie@kelly.us" }, false);
    user1.passwordHash = "anything";

    const user2 = await generateUser({ email: "charlie@kelly.us" });
    user2.passwordHash = "anything";
    user2.isEmailConfirmed = true;

    expect(user1.isActive).toBeFalsy();
    expect(user2.isActive).toBeTruthy();
  });

  test("name is computed correctly", async () => {
    const user1 = await generateUser({
      firstName: "Charlie",
      lastName: "Kelly",
      email: "charlie@kelly.us",
    });
    const user2 = await generateUser({
      firstName: "Charlie",
      lastName: undefined,
      email: "charlie@kelly.us",
    });
    const user3 = await generateUser({
      firstName: undefined,
      lastName: "Kelly",
      email: "charlie@kelly.us",
    });
    const user4 = await generateUser({ email: "charlie@kelly.us", firstName: undefined, lastName: undefined });

    expect(user1.name).toBe("Charlie Kelly");
    expect(user2.name).toBe("Charlie");
    expect(user3.name).toBe("Kelly");
    expect(user4.name).toBeNull();
  });
});
