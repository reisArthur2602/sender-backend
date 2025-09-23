import prisma from "../../database/prisma.js";
import { recoverCache, saveCache } from "../../database/redis.js";

type MenuResponse = {
  id: string;
  name: string;
  reply: string;
  tags: string[];
  isDefault: boolean;
  createdAt: Date;
  options: {
    id: string;
    label: string;
    reply: string;
    trigger: number;
  }[];
};

export const getMenus = async () => {
  const menuCached = await recoverCache<MenuResponse[]>("menus");

  if (menuCached && menuCached.length > 0) return menuCached;

  const menus = await prisma.menu.findMany({
    select: {
      id: true,
      name: true,
      reply: true,
      tags: true,
      isDefault: true,
      createdAt: true,
      options: {
        select: {
          id: true,
          label: true,
          trigger: true,
          reply: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  await saveCache("menus", menus);

  return menus;
};
