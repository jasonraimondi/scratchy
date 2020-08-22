--create_email_confirmation_tokens_table (down)
ALTER TABLE "email_confirmation_tokens"
    DROP CONSTRAINT "email_confirmation_tokens_userid_foreign";

DROP TABLE "email_confirmation_tokens";
