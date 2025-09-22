type Props = {
  senderName: string;
  jid: string;
  text: string;
};

export const processMessage = async ({ jid, senderName, text }: Props) => {
  console.log({ jid, senderName, text });
};
