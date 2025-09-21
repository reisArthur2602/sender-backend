import prisma from "../../database/prisma.js";

export const getMenus = async () => {
  const menus = await prisma.menu.findMany();
  return menus;
};
