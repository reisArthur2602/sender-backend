import prisma from "../../database/prisma.js";
import { invalidadeCache } from "../../database/redis.js";
import { ConflictError } from "../../utils/errors-handlers.js";
import type { CreateMenuInput } from "../../zod/menu/create-menu-schema.js";

export const createMenu = async ({
  name,
  reply,
  tags,
  options,
}: CreateMenuInput) => {
  const existsMenu = await prisma.menu.findUnique({
    where: {
      name,
    },
  });

  if (existsMenu) throw new ConflictError("O nome do menu já está em uso");

  await prisma.menu.create({
    data: {
      name,
      reply,
      tags,
      options: {
        create: options?.map((option) => ({
          label: option.label,
          reply: option.reply,
          trigger: option.trigger,
        })),
      },
    },
  });

  await invalidadeCache("menus");
};
