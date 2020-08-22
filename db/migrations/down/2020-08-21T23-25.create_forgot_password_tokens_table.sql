--create_forgot_password_tokens_table (down)

ALTER TABLE "forgot_password_tokens"
    DROP CONSTRAINT "forgot_password_tokens_userid_foreign";

DROP TABLE "forgot_password_tokens";
