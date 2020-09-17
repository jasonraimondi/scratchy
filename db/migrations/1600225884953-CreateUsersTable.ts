import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1600225884953 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "users"
        (
            "id"               UUID                        NOT NULL,
            "email"            VARCHAR(255)                NOT NULL,
            "password"         VARCHAR(255)                NULL,
            "firstName"        VARCHAR(255)                NULL,
            "lastName"         VARCHAR(255)                NULL,
            "isEmailConfirmed" BOOLEAN                     NOT NULL DEFAULT '0',
            "tokenVersion"     INTEGER                     NOT NULL DEFAULT 1,
            "lastLoginIP"      INET                        NULL,
            "lastLoginAt"      TIMESTAMP WITHOUT TIME ZONE NULL,
            "createdIP"        INET                        NULL,
            "createdAt"        TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt"        TIMESTAMP WITHOUT TIME ZONE NULL,
            CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "users_email_unique" UNIQUE ("email")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`)
  }
}
