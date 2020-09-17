import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmailConfirmationTokensTable1600226110767 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "email_confirmation_tokens"
        (
            "id"        UUID                        NOT NULL,
            "userId"    UUID                        NOT NULL,
            "expiresAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT "email_confirmation_tokens_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "fkey_emailconfirmationtokens_users_userid" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "email_confirmation_tokens"
            DROP CONSTRAINT "email_confirmation_tokens_userid_foreign";

        DROP TABLE "email_confirmation_tokens";
    `);
  }

}
