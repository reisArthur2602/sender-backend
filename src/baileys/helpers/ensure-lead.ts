import { recoverCache, saveCache } from "../../database/redis.js";
import { createLead } from "../../functions/lead/create.js";

type State = "idle" | "await_option";

type Props = {
  name: string;
  jid: string;
};

type SelectedMenu = {
  id: string;
  name: string;
  reply: string;
  tags: string[];
  isDefault: boolean;
  createdAt: Date;
  options: {
    id: string;
    reply: string;
    trigger: number;
  }[];
};

type CurrentLead = {
  name: string;
  jid: string;
  selectedMenu: SelectedMenu | null;
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
    selectedMenu: null,
    state: "idle",
  };

  await saveCache(`lead:${createdLead.jid}`, currentLead);

  return currentLead;
};
