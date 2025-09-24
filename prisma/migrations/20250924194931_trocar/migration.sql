/*
  Warnings:

  - You are about to drop the column `leadId` on the `matches` table. All the data in the column will be lost.
  - Added the required column `leadJid` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."matches" DROP CONSTRAINT "matches_leadId_fkey";

-- AlterTable
ALTER TABLE "public"."matches" DROP COLUMN "leadId",
ADD COLUMN     "leadJid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."matches" ADD CONSTRAINT "matches_leadJid_fkey" FOREIGN KEY ("leadJid") REFERENCES "public"."leads"("jid") ON DELETE CASCADE ON UPDATE CASCADE;
