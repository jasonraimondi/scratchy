ALTER TABLE "user_roles"
    DROP CONSTRAINT "user_roles_userid_foreign",
    DROP CONSTRAINT "user_roles_roleid_foreign"
;

DROP TABLE "user_roles";

DROP TABLE "roles";
