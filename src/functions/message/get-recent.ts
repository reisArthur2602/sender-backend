import prisma from "../../database/prisma.js";

export const getRecentMessages = async () => {
  const messages = await prisma.message.findMany({
    where: {
      from: "CUSTOMER",
    },
   
    distinct: ["jid"],
    take: 4,

    select: {
      id: true,
      createdAt: true,
      jid: true,
      text: true,
    },
  });

  return messages;
};
