import prisma from "../../database/prisma.js";
import { NotFoundError } from "../../utils/errors-handlers.js";
import type { UpdateMenuInput } from "../../zod/menu/update-menu-schema.js";

export const updateMenu = async ({
  id,
  name,
  options,
  reply,
  tags,
}: UpdateMenuInput & { id: string }) => {
  const existsMenu = await prisma.menu.findUnique({ where: { id } });

  if (!existsMenu) {
    throw new NotFoundError("O menu não foi encontrado");
  }

  const hasMenuWithName = await prisma.menu.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (hasMenuWithName) {
    throw new NotFoundError("Este nome já está associado a outro menu");
  }

  return prisma.menu.update({
    where: { id },
    data: {
      name,
      tags,
      reply,
      options: options
        ? {
            upsert: options.map((opt) => ({
              where: { id: opt.id ?? "" },
              update: {
                reply: opt.reply,
                trigger: opt.trigger,
              },
              create: {
                reply: opt.reply,
                trigger: opt.trigger,
              },
            })),
          }
        : undefined,
    },
  });
};
