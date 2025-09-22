/*
  Warnings:

  - Changed the type of `trigger` on the `options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."options" DROP COLUMN "trigger",
ADD COLUMN     "trigger" INTEGER NOT NULL;
