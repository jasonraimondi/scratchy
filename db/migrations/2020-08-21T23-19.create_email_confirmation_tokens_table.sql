--create_email_confirmation_tokens_table (up)
CREATE TABLE "email_confirmation_tokens"
(
    "token"     UUID        NOT NULL,
    "userId"    UUID        NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL
);

ALTER TABLE "email_confirmation_tokens"
    ADD CONSTRAINT "email_confirmation_tokens_pkey" PRIMARY KEY ("token");

ALTER TABLE "email_confirmation_tokens"
    ADD CONSTRAINT "email_confirmation_tokens_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" ("id");
