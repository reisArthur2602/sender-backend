import type { WASocket } from "@whiskeysockets/baileys";
import { getMenus } from "../functions/menu/get.js";
import { ensureLead } from "./helpers/ensure-lead.js";
import { saveCache } from "../database/redis.js";
import { saveMessage } from "./helpers/save-message.js";
import uuid4 from "uuid4";

import { notify } from "../utils/notify.js";
import { createMatch } from "../functions/match/create.js";

type Props = {
  message: {
    senderName: string;
    jid: string;
    text: string;
  };
  sockWA: WASocket;
};

export const processMessage = async ({
  message: { jid, senderName, text },
  sockWA,
}: Props) => {
  const currentLead = await ensureLead({
    jid,
    name: senderName,
  });

  // salva mensagem recebida
  await saveMessage({
    from: "CUSTOMER",
    jid,
    text,
  });

  switch (currentLead.state) {
    case "idle": {
      const menus = await getMenus();

      // tenta achar por tag
      let menuMatch = menus.find((menu) =>
        menu.tags.some((tag) => text.includes(tag))
      );

      // se não achar, tenta default
      if (!menuMatch) {
        menuMatch = menus.find((menu) => menu.isDefault === true);
        if (!menuMatch) break; // se não tiver nada, para aqui
      }

      const menuHasOptions = menuMatch.options.length > 0;

      if (menuHasOptions) {
        // monta mensagem com opções
        const messageReply = `${menuMatch.reply}\n\n${menuMatch.options
          .map((option) => `${option.trigger} - ${option.label}`)
          .join("\n")}`;

        await sockWA.sendMessage(jid, { text: messageReply });

        // salva estado aguardando escolha
        await saveCache(`lead:${jid}`, {
          ...currentLead,
          state: "await_option",
          selectedMenu: menuMatch,
        });

        await saveMessage({
          from: "SYSTEM",
          jid,
          text: messageReply,
        });
      } else {
        // se não tiver opções, só responde o reply simples
        await sockWA.sendMessage(jid, { text: menuMatch.reply });

        await saveMessage({
          from: "SYSTEM",
          jid,
          text: menuMatch.reply,
        });

        // mantém lead como idle (não aguarda opção)
        await saveCache(`lead:${jid}`, {
          ...currentLead,
          state: "idle",
          selectedMenu: null,
        });
      }

      // sempre cria o match (mesmo sem opções)
      await createMatch({
        leadJid: currentLead.jid,
        menuId: menuMatch.id,
      });

      break;
    }

    case "await_option": {
      const parsed = parseInt(text);

      if (isNaN(parsed)) {
        // se não for número válido, reseta
        await saveCache(`lead:${jid}`, {
          ...currentLead,
          state: "idle",
          selectedMenu: null,
        });

        break;
      }

      const optionFound = currentLead.selectedMenu?.options.find(
        (option) => option.trigger === parsed
      );

      if (optionFound) {
        await sockWA.sendMessage(jid, { text: optionFound.reply });

        await saveMessage({
          from: "SYSTEM",
          jid,
          text: optionFound.reply,
        });

        notify("new_notification", {
          id: uuid4(),
          title: "Nova mensagem recebida",
          description: `Nova mensagem de ${senderName}`,
        });
      }

     
      await saveCache(`lead:${jid}`, {
        ...currentLead,
        state: "idle",
        selectedMenu: null,
      });

      break;
    }
  }
};
