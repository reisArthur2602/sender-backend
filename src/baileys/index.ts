import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import { processMessage } from "./process-message.js";
import { normalizeMessage } from "./helpers/normalize-message.js";
import type { Boom } from "@hapi/boom";

import { socket } from "../http/server.js";
import qrCodeTerminal from "qrcode-terminal";
import fs from "fs";

type Status = "connecting" | "connected" | "pending";

export const baileysServerInit = async () => {
  const path = "./whatsapp";

  const { state, saveCreds } = await useMultiFileAuthState(path);
  const sockWA = makeWASocket({ auth: state });

  let status: Status = "pending";
  let qrCode: string | null = null;

  sockWA.ev.on(
    "connection.update",
    async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        qrCodeTerminal.generate(qr, { small: true });
        status = "pending";
        qrCode = qr;
      }

      switch (connection) {
        case "connecting": {
          status = "connecting";
          break;
        }

        case "open": {
          status = "connected";
          break;
        }

        case "close": {
          const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;

          if (reason === DisconnectReason.loggedOut) {
            fs.rmSync(path, { recursive: true, force: true });
          }

          await baileysServerInit();
          break;
        }
      }

      socket.emit("connection.status", { status, qr: qrCode });
    }
  );

  sockWA.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg?.key?.fromMe) return;

    const ignoredTypes = [
      "senderKeyDistributionMessage",
      "status@broadcast",
      "protocolMessage",
      "reactionMessage",
      "ephemeralMessage",
    ];

    const messageType = Object.keys(msg.message)[0];

    if (
      ignoredTypes.includes(messageType!) ||
      msg.key.remoteJid?.endsWith("@g.us") ||
      msg.key.remoteJid?.endsWith("@newsletter") ||
      msg.key.remoteJid?.endsWith("@status")
    )
      return;

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

  socket.on("connection", (client) => {
    client.emit("connection.status", { status, qr: qrCode });

    client.on("session.disconnect", async () => {
      fs.rmSync(path, { recursive: true, force: true });
      await baileysServerInit();
    });
  });
};
