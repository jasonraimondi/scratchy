/*
  Warnings:

  - A unique constraint covering the columns `[provider,id]` on the table `OAuthProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,provider]` on the table `OAuthProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "idx_provider_id" ON "OAuthProvider"("provider", "id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_userid_provider" ON "OAuthProvider"("userId", "provider");
