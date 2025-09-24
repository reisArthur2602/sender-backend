import prisma from "../../database/prisma.js";
import { invalidadeCache } from "../../database/redis.js";
import { NotFoundError } from "../../utils/errors-handlers.js";

export const deleteMenu = async (menuId: string) => {
  const existsMenu = await prisma.menu.findUnique({
    where: {
      id: menuId,
    },
  });
  if (!existsMenu) throw new NotFoundError("O menu não foi encontrado");

  await prisma.menu.delete({
    where: { id: menuId },
  });

  await invalidadeCache("menus");
};
