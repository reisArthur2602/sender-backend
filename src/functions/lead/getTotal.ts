import prisma from "../../database/prisma.js";

export const getTotalLeads = async () => {
  const total = await prisma.lead.count();
  return total;
};
