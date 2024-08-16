/*
  Warnings:

  - Made the column `userId` on table `Schema` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Schema" ALTER COLUMN "userId" SET NOT NULL;
