import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsTable1600226150042 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "permissions"
        (
            "id"   SERIAL            NOT NULL,
            "name" CHARACTER VARYING NOT NULL,
            CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE "user_permissions"
        (
            "userId"       UUID    NOT NULL,
            "permissionId" INTEGER NOT NULL,
            CONSTRAINT "pkey_userpermissions_usersid_permissionsid" PRIMARY KEY ("userId", "permissionId"),
            CONSTRAINT "fkey_userpermissions_users_usersid" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_userpermissions_permissions_permissionsid" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        )

    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
        ALTER TABLE "user_permissions"
            DROP CONSTRAINT "user_permissions_userid_foreign",
            DROP CONSTRAINT "user_permissions_permissionid_foreign"
        ;

        DROP TABLE "user_permissions";

        DROP TABLE "permissions";

    `);

  }

}
