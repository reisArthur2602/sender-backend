-- CreateEnum
CREATE TYPE "public"."MessageFrom" AS ENUM ('CUSTOMER', 'SYSTEM');

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "from" "public"."MessageFrom" NOT NULL,
    "text" TEXT NOT NULL,
    "jid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_jid_fkey" FOREIGN KEY ("jid") REFERENCES "public"."leads"("jid") ON DELETE CASCADE ON UPDATE CASCADE;
