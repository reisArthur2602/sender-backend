import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";

import { ensurePath } from "./helpers/ensure-path.js";
import { processMessage } from "./process-message.js";

import { processConnection } from "./process-connection.js";
import { normalizeMessage } from "./helpers/normalize-message.js";

export const baileysServerInit = async (instanceId: string) => {
  const path = ensurePath(instanceId);

  const { state, saveCreds } = await useMultiFileAuthState(path);
  const sockWA = makeWASocket({ auth: state });

  sockWA.ev.on(
    "connection.update",
    async ({ connection, lastDisconnect, qr }) => {
      await processConnection({ connection, lastDisconnect, qr, instanceId });
    }
  );

  sockWA.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg?.key?.fromMe) return;

    const senderName = msg.pushName || "";

    const jid = msg.key.remoteJid!;

    const text =
      msg.message.conversation || msg.message?.extendedTextMessage?.text || "";

    await processMessage({
      message: { jid, senderName, text: normalizeMessage(text) },
      sockWA,
    });
  });

  sockWA.ev.on("creds.update", saveCreds);
};
