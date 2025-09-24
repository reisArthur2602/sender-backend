import prisma from "../../database/prisma.js";

export const getTotalMenus = async () => {
  const total = await prisma.menu.count();
  return total;
};
