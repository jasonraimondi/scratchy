--create_forgot_password_tokens_table (up)
CREATE TABLE "forgot_password_tokens"
(
    "token"     UUID        NOT NULL,
    "userId"    UUID        NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL
);

ALTER TABLE "forgot_password_tokens"
    ADD CONSTRAINT "forgot_password_tokens_pkey" PRIMARY KEY ("token");

ALTER TABLE "forgot_password_tokens"
    ADD CONSTRAINT "forgot_password_tokens_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" ("id");
