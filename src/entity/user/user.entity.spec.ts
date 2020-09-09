import { userGenerator } from "~test/generators/user.generator";

describe("user entity", () => {
  test("isActive computed correctly", async () => {
    const user1 = await userGenerator({ email: "charlie@kelly.us" });
    user1.password = "anything";

    const user2 = await userGenerator({ email: "charlie@kelly.us" });
    user2.password = "anything";
    user2.isEmailConfirmed = true;

    expect(user1.isActive).toBeFalsy();
    expect(user2.isActive).toBeTruthy();
  });

  test("name is computed correctly", async () => {
    const user1 = await userGenerator({
      firstName: "Charlie",
      lastName: "Kelly",
      email: "charlie@kelly.us",
    });
    const user2 = await userGenerator({
      firstName: "Charlie",
      lastName: undefined,
      email: "charlie@kelly.us",
    });
    const user3 = await userGenerator({
      firstName: undefined,
      lastName: "Kelly",
      email: "charlie@kelly.us",
    });
    const user4 = await userGenerator({ email: "charlie@kelly.us", firstName: undefined, lastName: undefined });

    expect(user1.name).toBe("Charlie Kelly");
    expect(user2.name).toBe("Charlie");
    expect(user3.name).toBe("Kelly");
    expect(user4.name).toBeNull();
  });
});
