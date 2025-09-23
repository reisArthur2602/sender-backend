import prisma from "../../database/prisma.js";

type From = "CUSTOMER" | "SYSTEM";

type Props = {
  from: From;
  text: string;
  jid: string;
};

export const saveMessage = async ({ from, jid, text }: Props) => {
  await prisma.message.create({
    data: { from, text, jid },
  });
};
