import { recoverCache, saveCache } from "../../database/redis.js";
import { createLead } from "../../functions/lead/create.js";
import { notify } from "../../utils/notify.js";
import uuid4 from "uuid4";

type State = "idle" | "await_option";

type Props = {
  name: string;
  jid: string;
};

export type MenuMatch = {
  id: string;
  name: string;
  reply: string;
  tags: string[];
  isDefault: boolean;
  createdAt: Date;
  options: {
    id: string;
    label: string;
    reply: string;
    trigger: number;
  }[];
};

type CurrentLead = {
  name: string;
  jid: string;
  menuMatch: MenuMatch | null;
  isFirstInteration: boolean;
  state: State;
};

export const ensureLead = async ({ jid, name }: Props) => {
  let currentLead: CurrentLead | null;

  currentLead = await recoverCache<CurrentLead>(`lead:${jid}`);
  if (currentLead) return currentLead;

  const createdLead = await createLead({ jid, name });

  currentLead = {
    name,
    jid: createdLead.jid,
    menuMatch: null,
    state: "idle",
    isFirstInteration: true,
  };

  await saveCache(`lead:${createdLead.jid}`, currentLead, 60 * 60);

  notify("new_notification", {
    id: uuid4(),
    title: "Novo contato adicionado",
    description: `${name} agora está na sua lista de contatos.`,
  });

  return currentLead;
};
