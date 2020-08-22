--create_users_table (up)
CREATE TABLE "users"
(
    "id"               UUID         NOT NULL,
    "email"            VARCHAR(255) NOT NULL,
    "password"         VARCHAR(255) NULL,
    "firstName"        VARCHAR(255) NULL,
    "lastName"         VARCHAR(255) NULL,
    "isEmailConfirmed" BOOLEAN      NOT NULL DEFAULT '0',
    "tokenVersion"     INTEGER      NOT NULL DEFAULT 1,
    "lastLoginIP"      INET         NULL,
    "lastLoginAt"      TIMESTAMPTZ  NULL,
    "createdIP"        INET         NULL,
    "createdAt"        TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMPTZ  NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_email_unique" UNIQUE ("email")
);

