--create_forgot_password_tokens_table (up)
CREATE TABLE "forgot_password_tokens"
(
    "id"        UUID        NOT NULL,
    "userId"    UUID        NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "forgot_password_tokens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "forgot_password_tokens_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" ("id")
);
