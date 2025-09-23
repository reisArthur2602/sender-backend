/*
  Warnings:

  - Added the required column `label` to the `options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."options" ADD COLUMN     "label" TEXT NOT NULL;
