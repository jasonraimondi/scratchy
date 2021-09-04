/*
  Warnings:

  - You are about to drop the column `oauthGithubIdentifier` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oauthGoogleIdentifier` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('facebook', 'github', 'google');

-- DropIndex
DROP INDEX "User.oauthGithubIdentifier_unique";

-- DropIndex
DROP INDEX "User.oauthGoogleIdentifier_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauthGithubIdentifier",
DROP COLUMN "oauthGoogleIdentifier";

-- CreateTable
CREATE TABLE "OAuthProvider" (
    "id" VARCHAR(255) NOT NULL,
    "provider" "Provider" NOT NULL,
    "userId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_oauthprovider_userid" ON "OAuthProvider"("userId");

-- AddForeignKey
ALTER TABLE "OAuthProvider" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
