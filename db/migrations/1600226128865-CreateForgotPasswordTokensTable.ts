import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateForgotPasswordTokensTable1600226128865 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "forgot_password_tokens"
        (
            "id"        UUID                        NOT NULL,
            "userId"    UUID                        NOT NULL,
            "expiresAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT "forgot_password_tokens_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "fkey_forgotpasswordtokens_users_userid" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "forgot_password_tokens"
            DROP CONSTRAINT "forgot_password_tokens_userid_foreign";

        DROP TABLE "forgot_password_tokens";
    `);
  }

}
