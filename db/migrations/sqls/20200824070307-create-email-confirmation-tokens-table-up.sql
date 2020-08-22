--create_email_confirmation_tokens_table (up)
CREATE TABLE "email_confirmation_tokens"
(
    "id"        UUID        NOT NULL,
    "userId"    UUID        NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "email_confirmation_tokens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "email_confirmation_tokens_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" ("id")
);
