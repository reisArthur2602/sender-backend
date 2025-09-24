import prisma from "../../database/prisma.js";

export const getLeads = async () => {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return leads;
};
