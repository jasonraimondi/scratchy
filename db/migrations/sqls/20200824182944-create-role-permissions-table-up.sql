CREATE TABLE "role_permissions"
(
    "roleId" integer NOT NULL,
    "permissionId" integer NOT NULL,
    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId", "permissionId"),
    CONSTRAINT "role_permissions_roleid_foreign" FOREIGN KEY ("roleId") REFERENCES "roles" ("id"),
    CONSTRAINT "role_permissions_permissionid_foreign" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id")
)
