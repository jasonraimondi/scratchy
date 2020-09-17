import { CustomNamingStrategy } from "~/lib/naming";

describe("naming", () => {
  let naming: CustomNamingStrategy;

  beforeEach(() => {
    naming = new CustomNamingStrategy();
  });

  test("foreign key name", () => {
    const output = naming.foreignKeyName("oauth_authorization_codes", ["userId"], "users", ["id"]);
    expect(output).toBe("fkey_oauthauthorizationcodes_users_userid");
  });

  test("primary key name", () => {
    const output = naming.primaryKeyName("oauth_access_tokens", ["token"]);
    expect(output).toBe("pkey_oauthaccesstokens_token");
  });

  test("index name", () => {
    const output = naming.indexName("oauth_authorization_codes", ["userId"]);
    expect(output).toBe("idx_oauthauthorizationcodes_userid");
  });

  test("unique constraint name", () => {
    const output = naming.uniqueConstraintName("oauth_authorization_codes", ["userId"]);
    expect(output).toBe("unq_oauthauthorizationcodes_userid");
  });
});
