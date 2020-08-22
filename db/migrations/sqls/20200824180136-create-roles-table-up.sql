--create_roles_table (up)
CREATE TABLE "roles"
(
    "id" SERIAL NOT NULL,
    "name" character varying NOT NULL,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_roles"
(
    "userId" UUID NOT NULL,
    "roleId" integer NOT NULL,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId", "roleId"),
    CONSTRAINT "user_roles_userid_foreign" FOREIGN KEY ("userId") REFERENCES "users" ("id"),
    CONSTRAINT "user_roles_roleid_foreign" FOREIGN KEY ("roleId") REFERENCES "roles" ("id")
)
