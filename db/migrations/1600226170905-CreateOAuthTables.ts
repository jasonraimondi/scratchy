import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOAuthTables1600226170905 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "oauth_clients"
        (
            "id"           UUID                        NOT NULL,
            "secret"       UUID                        NOT NULL,
            "name"         TEXT                        NOT NULL,
            "redirectUris" TEXT                        NOT NULL,
            "createdAt"    TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "oauth_clients_name_unique" UNIQUE ("name")
        );

        CREATE TABLE "oauth_scopes"
        (
            "id"        SERIAL                      NOT NULL,
            "name"      TEXT                        NOT NULL,
            "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "oauth_scopes_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "oauth_scopes_name_unique" UNIQUE ("name")
        );

        CREATE TABLE "oauth_auth_codes"
        (
            "token"        UUID                        NOT NULL,
            "userId"       UUID                        NOT NULL,
            "clientId"     UUID                        NOT NULL,
            "redirectUris" TEXT                        NOT NULL,
            "expiresAt"    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            "createdAt"    TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "oauth_auth_codes_pkey" PRIMARY KEY ("token"),
            CONSTRAINT "fkey_oauthauthcodes_oauthclients_clientid" FOREIGN KEY ("clientId") REFERENCES "oauth_clients" ("id"),
            CONSTRAINT "fkey_oauthauthcodes_users_userid" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );

        CREATE TABLE "oauth_refresh_tokens"
        (
            "token"     UUID                        NOT NULL,
            "expiresAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("token")
        );

        CREATE TABLE "oauth_access_tokens"
        (
            "token"             UUID                        NOT NULL,
            "clientId"          UUID                        NOT NULL,
            "refreshTokenToken" UUID                        NOT NULL,
            "userId"            UUID                        NOT NULL,
            "expiresAt"         TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            "createdAt"         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("token"),
            CONSTRAINT "fkey_oauthaccesstokens_oauthclients_clientid" FOREIGN KEY ("clientId") REFERENCES "oauth_clients" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_oauthaccesstokens_oauthrefreshtokens_refreshtokentoken" FOREIGN KEY ("refreshTokenToken") REFERENCES "oauth_refresh_tokens" ("token") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_oauthaccesstokens_users_userid" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );

        CREATE TABLE "oauth_access_token_scopes"
        (
            "accessTokenToken" UUID    NOT NULL,
            "scopeId"          INTEGER NOT NULL,
            CONSTRAINT "oauth_access_token_scopes_pkey" PRIMARY KEY ("accessTokenToken", "scopeId"),
            CONSTRAINT "fkey_oauthaccesstokenscopes_oauthaccesstokens_accesstokentoken" FOREIGN KEY ("accessTokenToken") REFERENCES "oauth_access_tokens" ("token") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_oauthaccesstokenscopes_oauthscopes_scopeid" FOREIGN KEY ("scopeId") REFERENCES "oauth_scopes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );

        CREATE TABLE "oauth_auth_code_scopes"
        (
            "authCodeToken" UUID    NOT NULL,
            "scopeId"       INTEGER NOT NULL,
            CONSTRAINT "oauth_auth_code_scopes_pkey" PRIMARY KEY ("authCodeToken", "scopeId"),
            CONSTRAINT "fkey_oauthauthcodescopes_oauthauthcodes_authcodetoken" FOREIGN KEY ("authCodeToken") REFERENCES "oauth_auth_codes" ("token") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_oauthauthcodescopes_oauthscopes_scopeid" FOREIGN KEY ("scopeId") REFERENCES "oauth_scopes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );

        INSERT INTO "oauth_clients" ("id", "secret", "name", "redirectUris")
        VALUES ('a1e45dfd-9505-40de-b5ac-220b9e417177', '245299ee-6657-4991-8d37-429c96ace8f1', 'scratchy',
                'localhost');

        INSERT INTO "oauth_scopes" (name)
        VALUES ('admin');

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "oauth_auth_codes"
            DROP CONSTRAINT "oauth_auth_codes_clientid_foreign",
            DROP CONSTRAINT "oauth_auth_codes_userid_foreign";

        ALTER TABLE "oauth_access_tokens"
            DROP CONSTRAINT "oauth_access_tokens_clientid_foreign",
            DROP CONSTRAINT "oauth_access_tokens_userid_foreign";

        ALTER TABLE "oauth_refresh_tokens"
            DROP CONSTRAINT "oauth_refresh_tokens_accesstokentoken_foreign";

        ALTER TABLE "oauth_access_token_scopes"
            DROP CONSTRAINT "oauth_access_token_scopes_accesstokentoken_foreign",
            DROP CONSTRAINT "oauth_access_token_scopes_scopeid_foreign";

        ALTER TABLE "oauth_auth_code_scopes"
            DROP CONSTRAINT "oauth_auth_code_scopes_authcodetoken_foreign",
            DROP CONSTRAINT "oauth_auth_code_scopes_scopeid_foreign";


        DROP TABLE oauth_refresh_tokens;
        DROP TABLE oauth_access_tokens;
        DROP TABLE oauth_auth_codes;
        DROP TABLE oauth_clients;
        DROP TABLE oauth_scopes;
        DROP TABLE oauth_auth_code_scopes;
        DROP TABLE oauth_access_token_scopes;
    `);
  }

}
