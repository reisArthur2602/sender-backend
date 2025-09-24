import prisma from "../../database/prisma.js";

export const getTotalMessages = async () => {
  const total = await prisma.message.count({ where: { from: "CUSTOMER" } });
  return total;
};
