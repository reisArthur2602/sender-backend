import prisma from "../../database/prisma.js";
import { invalidadeCache } from "../../database/redis.js";
import { NotFoundError } from "../../utils/errors-handlers.js";

export const updateStatusMenu = async (menuId: string) => {
  const menu = await prisma.menu.findUnique({ where: { id: menuId } });

  if (!menu) throw new NotFoundError("O menu não foi encontrado");

  await prisma.menu.update({
    where: { id: menuId },
    data: {
      isDefault: !menu?.isDefault,
    },
  });

  await invalidadeCache("menus");
};
