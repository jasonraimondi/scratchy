ALTER TABLE "role_permissions"
    DROP CONSTRAINT "role_permissions_roleid_foreign",
    DROP CONSTRAINT "role_permissions_permissionid_foreign"
;

DROP TABLE "role_permissions";
