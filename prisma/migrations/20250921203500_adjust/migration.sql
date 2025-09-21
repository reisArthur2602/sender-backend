/*
  Warnings:

  - You are about to drop the column `isActive` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `options` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."menus" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "public"."options" DROP COLUMN "label";
