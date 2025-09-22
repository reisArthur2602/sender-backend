import prisma from "../../database/prisma.js";

export const getMenus = async () => {
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
          reply: true,
          trigger: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return menus;
};
