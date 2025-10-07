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

  await saveMessage({
    from: "CUSTOMER",
    jid,
    text,
  });

  switch (currentLead.state) {
    case "idle": {
      const menus = await getMenus();

      let menuMatch = menus.find((menu) =>
        menu.tags.some((tag) => text.includes(tag))
      );

      if (!menuMatch && currentLead.isFirstInteration) {
        const welcomeMenu = menus.find((menu) => menu.isDefault);
        if (!welcomeMenu) break;

        const welcomeMessageReply =
          welcomeMenu.options.length > 0
            ? `${welcomeMenu.reply}\n\n${welcomeMenu.options.map(
                (o) => `${o.trigger} - ${o.label}\n\n`
              )}`
            : welcomeMenu.reply;

        await sockWA.sendMessage(jid, { text: welcomeMessageReply });

        notify("new_notification", {
          id: uuid4(),
          title: "Você recebeu uma nova mensagem",
          description: `Nova mensagem de ${senderName}.`,
        });

        await saveMessage({ from: "SYSTEM", jid, text: welcomeMessageReply });

        await saveCache(`lead:${jid}`, {
          ...currentLead,
          state: welcomeMenu.options.length > 0 ? "await_option" : "idle",
          menuMatch: welcomeMenu,
          isFirstInteration: false,
        });

        await createMatch({ leadJid: currentLead.jid, menuId: welcomeMenu.id });
        return;
      }

      if (menuMatch) {
        const hasOptions = menuMatch.options.length > 0;
        const replyMessage = hasOptions
          ? `${menuMatch.reply}\n\n${menuMatch.options
              .map((o) => `${o.trigger} - ${o.label}`)
              .join("\n")}`
          : menuMatch.reply;

        await sockWA.sendMessage(jid, { text: replyMessage });

        notify("new_notification", {
          id: uuid4(),
          title: "Você recebeu uma nova mensagem",
          description: `Nova mensagem de ${senderName}.`,
        });

        await saveMessage({ from: "SYSTEM", jid, text: replyMessage });

        await saveCache(`lead:${jid}`, {
          ...currentLead,
          state: hasOptions ? "await_option" : "idle",
          menuMatch,
        });

        await createMatch({ leadJid: currentLead.jid, menuId: menuMatch.id });
        return;
      }

      break;
    }

    case "await_option": {
      const parsed = parseInt(text);
      if (!parsed || !currentLead.menuMatch) {
        await saveCache(`lead:${jid}`, {
          ...currentLead,
          state: "idle",
          menuMatch: null,
        });
        return;
      }

      const optionMatch = currentLead.menuMatch.options.find(
        (o) => o.trigger === parsed
      );
      if (optionMatch) {
        await sockWA.sendMessage(jid, { text: optionMatch.reply });
        await saveMessage({ from: "SYSTEM", jid, text: optionMatch.reply });
      }

      await saveCache(`lead:${jid}`, {
        ...currentLead,
        state: "idle",
        menuMatch: null,
      });
      break;
    }
  }
};
