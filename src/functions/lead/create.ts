import prisma from "../../database/prisma.js";
import { ConflictError } from "../../utils/errors-handlers.js";

type Props = {
  name: string;
  jid: string;
};

export const createLead = async (data: Props) => {
  const hasLeadWithJid = await prisma.lead.findUnique({
    where: { jid: data.jid },
  });

  if (hasLeadWithJid) {
    throw new ConflictError("Este número já esta cadastrado");
  }

  const lead = await prisma.lead.create({
    data,
    select: {
      jid: true,
    },
  });

  return lead;
};
