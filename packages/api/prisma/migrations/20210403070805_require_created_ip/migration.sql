/*
  Warnings:

  - Made the column `createdIP` on table `User` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdIP" SET NOT NULL;
