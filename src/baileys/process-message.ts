import type { WASocket } from "@whiskeysockets/baileys";
import { getMenus } from "../functions/menu/get.js";
import { ensureLead } from "./helpers/ensure-lead.js";
import { saveCache } from "../database/redis.js";
import { saveMessage } from "./helpers/save-message.js";

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
    jid: jid,
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

      const menuFound = menus.find((menu) =>
        menu.tags.some((tag) => text.includes(tag))
      );

      if (!menuFound) break;

      const messageReply = `${menuFound.reply}\n\n${
        menuFound.options.length > 0
          ? menuFound.options
              .map((option) => `${option.trigger} - ${option.label}`)
              .join("\n")
          : ""
      }`;

      await sockWA.sendMessage(jid, { text: messageReply });

      await saveCache(`lead:${jid}`, {
        ...currentLead,
        state: "await_option",
        selectedMenu: menuFound,
      });

      await saveMessage({
        from: "SYSTEM",
        jid,
        text: messageReply,
      });

      break;
    }

    case "await_option": {
      const parsed = parseInt(text);

      if (!parsed) {
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
      }

      await saveCache(`lead:${jid}`, {
        ...currentLead,
        state: "idle",
        selectedMenu: null,
      });

      await saveMessage({
        from: "SYSTEM",
        jid,
        text: optionFound?.reply as string,
      });

      break;
    }
  }
};
