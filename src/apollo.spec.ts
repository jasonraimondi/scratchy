import { Role } from "./entity/role/role_entity";
import { initializeApolloServer } from "./apollo";
import { User } from "./entity/user/user_entity";
import { Permission } from "./entity/role/permission_entity";
import { ForgotPassword } from "./entity/user/forgot_password_entity";
import { EmailConfirmation } from "./entity/user/email_confirmation_entity";

describe("apollo server", () => {
  test("boots and has endpoint", async () => {
    const entities = [
      User,
      Role,
      Permission,
      ForgotPassword,
      EmailConfirmation,
    ];
    const container = await TestingContainer.create(entities);
    const apollo = await initializeApolloServer(container);

    expect(apollo.graphqlPath).toBe("/graphql");
  });
});
