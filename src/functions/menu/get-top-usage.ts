import prisma from "../../database/prisma.js";

export const getTopUsageMenu = async (limit = 7) => {
  const menus = await prisma.menu.findMany({
    select: {
      name: true,
      _count: { select: { matches: true } },
    },
  });

  return menus
    .map((m) => ({ name: m.name, count: m._count.matches }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};
