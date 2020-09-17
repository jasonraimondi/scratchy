import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolePermissionsTable1600226162112 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "role_permissions"
        (
            "roleId"       INTEGER NOT NULL,
            "permissionId" INTEGER NOT NULL,
            CONSTRAINT "pkey_rolepermissions_permissionsid_rolesid" PRIMARY KEY ("roleId", "permissionId"),
            CONSTRAINT "fkey_rolepermissions_roles_rolesid" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "fkey_rolepermissions_permissions_permissionsid" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        )

    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "role_permissions"
            DROP CONSTRAINT "role_permissions_roleid_foreign",
            DROP CONSTRAINT "role_permissions_permissionid_foreign"
        ;

        DROP TABLE "role_permissions";

    `);

  }

}
