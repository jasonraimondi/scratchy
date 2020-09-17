import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1600226139590 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "roles"
        (
            "id"   SERIAL            NOT NULL,
            "name" CHARACTER VARYING NOT NULL,
            CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE "user_roles"
        (
            "userId" UUID    NOT NULL,
            "roleId" INTEGER NOT NULL,
            CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId", "roleId"),
            CONSTRAINT "fkey_userroles_users_userid" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_userroles_roles_roleid" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user_roles"
            DROP CONSTRAINT "user_roles_userid_foreign",
            DROP CONSTRAINT "user_roles_roleid_foreign"
        ;

        DROP TABLE "user_roles";

        DROP TABLE "roles";
    `);
  }

}
