/*
  Warnings:

  - You are about to drop the `OAuthProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OAuthProvider" DROP CONSTRAINT "OAuthProvider_userId_fkey";

-- DropTable
DROP TABLE "OAuthProvider";

-- CreateTable
CREATE TABLE "UserProvider" (
    "id" VARCHAR(255) NOT NULL,
    "provider" "Provider" NOT NULL,
    "userId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_provider_oauthprovider_userid" ON "UserProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_provider_provider_id" ON "UserProvider"("provider", "id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_provider_userid_provider" ON "UserProvider"("userId", "provider");

-- AddForeignKey
ALTER TABLE "UserProvider" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
