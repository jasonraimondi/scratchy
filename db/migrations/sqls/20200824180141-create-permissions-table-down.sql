ALTER TABLE "user_permissions"
    DROP CONSTRAINT "user_permissions_userid_foreign",
    DROP CONSTRAINT "user_permissions_permissionid_foreign"
;

DROP TABLE "user_permissions";

DROP TABLE "permissions";
