-- CreateEnum
CREATE TYPE "GrantTypes" AS ENUM ('client_credentials', 'authorization_code', 'refresh_token', 'implicit', 'password');

-- CreateEnum
CREATE TYPE "CodeChallengeMethod" AS ENUM ('s256', 'plain');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" VARCHAR(255),
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "lastHeartbeatAt" TIMESTAMP(6),
    "lastLoginAt" TIMESTAMP(6),
    "lastLoginIP" INET,
    "createdIP" INET NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "oauthGoogleIdentifier" VARCHAR(255),
    "oauthGithubIdentifier" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" UUID NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailConfirmationToken" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForgotPasswordToken" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "permissionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "permissionId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" INTEGER,

    PRIMARY KEY ("userId","permissionId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "roleId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "OAuthClient" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "secret" VARCHAR(255),
    "redirectUris" TEXT[],
    "allowedGrants" "GrantTypes"[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauthClient_oauthScope" (
    "clientId" UUID NOT NULL,
    "scopeId" UUID NOT NULL,

    PRIMARY KEY ("clientId","scopeId")
);

-- CreateTable
CREATE TABLE "OAuthAuthCode" (
    "code" TEXT NOT NULL,
    "redirectUri" TEXT,
    "codeChallenge" TEXT,
    "codeChallengeMethod" "CodeChallengeMethod" NOT NULL DEFAULT E'plain',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID,
    "clientId" UUID NOT NULL,

    PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "OAuthToken" (
    "accessToken" TEXT NOT NULL,
    "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "clientId" UUID NOT NULL,
    "userId" UUID,

    PRIMARY KEY ("accessToken")
);

-- CreateTable
CREATE TABLE "OAuthScope" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OAuthClientToOAuthScope" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_OAuthAuthCodeToOAuthScope" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_OAuthScopeToOAuthToken" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.oauthGoogleIdentifier_unique" ON "User"("oauthGoogleIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "User.oauthGithubIdentifier_unique" ON "User"("oauthGithubIdentifier");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_fileupload_userid" ON "FileUpload"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmationToken.userId_unique" ON "EmailConfirmationToken"("userId");

-- CreateIndex
CREATE INDEX "idx_emailconfirmationtoken_userid" ON "EmailConfirmationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken.userId_unique" ON "ForgotPasswordToken"("userId");

-- CreateIndex
CREATE INDEX "idx_forgotpasswordtoken_userid" ON "ForgotPasswordToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role.name_unique" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission.name_unique" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "idx_oauthclient_oauthscope_clientid" ON "oauthClient_oauthScope"("clientId");

-- CreateIndex
CREATE INDEX "idx_oauthclient_oauthscope_scopeid" ON "oauthClient_oauthScope"("scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken.refreshToken_unique" ON "OAuthToken"("refreshToken");

-- CreateIndex
CREATE INDEX "idx_oauthtoken_accesstoken" ON "OAuthToken"("accessToken");

-- CreateIndex
CREATE INDEX "idx_oauthtoken_refreshtoken" ON "OAuthToken"("refreshToken");

-- CreateIndex
CREATE INDEX "idx_oauthscope_name" ON "OAuthScope"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_OAuthClientToOAuthScope_AB_unique" ON "_OAuthClientToOAuthScope"("A", "B");

-- CreateIndex
CREATE INDEX "_OAuthClientToOAuthScope_B_index" ON "_OAuthClientToOAuthScope"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OAuthAuthCodeToOAuthScope_AB_unique" ON "_OAuthAuthCodeToOAuthScope"("A", "B");

-- CreateIndex
CREATE INDEX "_OAuthAuthCodeToOAuthScope_B_index" ON "_OAuthAuthCodeToOAuthScope"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OAuthScopeToOAuthToken_AB_unique" ON "_OAuthScopeToOAuthToken"("A", "B");

-- CreateIndex
CREATE INDEX "_OAuthScopeToOAuthToken_B_index" ON "_OAuthScopeToOAuthToken"("B");

-- AddForeignKey
ALTER TABLE "FileUpload" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailConfirmationToken" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForgotPasswordToken" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauthClient_oauthScope" ADD FOREIGN KEY ("clientId") REFERENCES "OAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauthClient_oauthScope" ADD FOREIGN KEY ("scopeId") REFERENCES "OAuthScope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAuthCode" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAuthCode" ADD FOREIGN KEY ("clientId") REFERENCES "OAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthToken" ADD FOREIGN KEY ("clientId") REFERENCES "OAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthToken" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OAuthClientToOAuthScope" ADD FOREIGN KEY ("A") REFERENCES "OAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OAuthClientToOAuthScope" ADD FOREIGN KEY ("B") REFERENCES "OAuthScope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OAuthAuthCodeToOAuthScope" ADD FOREIGN KEY ("A") REFERENCES "OAuthAuthCode"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OAuthAuthCodeToOAuthScope" ADD FOREIGN KEY ("B") REFERENCES "OAuthScope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OAuthScopeToOAuthToken" ADD FOREIGN KEY ("A") REFERENCES "OAuthScope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OAuthScopeToOAuthToken" ADD FOREIGN KEY ("B") REFERENCES "OAuthToken"("accessToken") ON DELETE CASCADE ON UPDATE CASCADE;
