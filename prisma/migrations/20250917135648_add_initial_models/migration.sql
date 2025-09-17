-- CreateTable
CREATE TABLE "public"."menus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."options" (
    "id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."leads" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "jid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_name_key" ON "public"."menus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "leads_jid_key" ON "public"."leads"("jid");

-- AddForeignKey
ALTER TABLE "public"."options" ADD CONSTRAINT "options_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
