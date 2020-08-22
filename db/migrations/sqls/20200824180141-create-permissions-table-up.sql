CREATE TABLE "permissions"
(
    "id" SERIAL NOT NULL,
    "name" character varying NOT NULL,
    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_permissions"
(
    "userId" UUID NOT NULL,
    "permissionId" integer NOT NULL,
    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("userId", "permissionId"),
    CONSTRAINT "user_permissions_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    CONSTRAINT "user_permissions_permissionid_foreign" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id")
)
