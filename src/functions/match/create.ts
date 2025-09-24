import prisma from "../../database/prisma.js";

type Props = {
  menuId: string;
  leadJid: string;
};

export const createMatch = async (data: Props) => {
  await prisma.match.create({
    data,
  });
};
