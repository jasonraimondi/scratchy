import { User } from "./user";

describe("user entity", () => {
  test("isActive computed correctly", async () => {
    const user1 = await User.create({ email: "charlie@kelly.us" });
    user1.password = "anything";

    const user2 = await User.create({ email: "charlie@kelly.us" });
    user2.password = "anything";
    user2.isEmailConfirmed = true;

    expect(user1.isActive(user1)).toBeFalsy();
    expect(user2.isActive(user2)).toBeTruthy();
  });

  test("name is computed correctly", async () => {
    const user1 = await User.create({
      firstName: "Charlie",
      lastName: "Kelly",
      email: "charlie@kelly.us",
    });
    const user2 = await User.create({
      firstName: "Charlie",
      email: "charlie@kelly.us",
    });
    const user3 = await User.create({
      lastName: "Kelly",
      email: "charlie@kelly.us",
    });
    const user4 = await User.create({ email: "charlie@kelly.us" });

    expect(user1.name).toBe("Charlie Kelly");
    expect(user2.name).toBe("Charlie");
    expect(user3.name).toBe("Kelly");
    expect(user4.name).toBeUndefined();
  });
});
