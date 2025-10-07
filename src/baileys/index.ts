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

let sockWA: ReturnType<typeof makeWASocket> | null = null;
let reconnecting = false;

export const baileysServerInit = async () => {
  const path = "./auth-info-baileys";

  const { state, saveCreds } = await useMultiFileAuthState(path);

  if (sockWA) {
    sockWA.ev.removeAllListeners("connection.update");
    sockWA.ev.removeAllListeners("messages.upsert");
    sockWA.ev.removeAllListeners("creds.update");
  }

  sockWA = makeWASocket({ auth: state });

  let status: Status = "connecting";
  let qrCode: string | null = null;

  sockWA.ev.on(
    "connection.update",
    async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        qrCodeTerminal.generate(qr, { small: true });
        status = "pending";
        qrCode = qr;
      }

      if (connection === "connecting") {
        status = "connecting";
      }

      if (connection === "open") {
        status = "connected";
        qrCode = null;
      }

      if (connection === "close") {
        const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
          fs.rmSync(path, { recursive: true, force: true });
          qrCode = null;
          status = "pending";
          console.warn("Sessão desconectada. Reautenticação necessária.");
        }

        if (!reconnecting) {
          reconnecting = true;
          setTimeout(async () => {
            reconnecting = false;
            await baileysServerInit();
          }, 3000);
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
      sockWA: sockWA!,
    });
  });

  sockWA.ev.on("creds.update", saveCreds);

  socket.on("connection", (client) => {
    client.emit("connection.status", { status, qr: qrCode });

    client.on("session.disconnect", async () => {
      status = "connecting";
      if (!reconnecting) {
        reconnecting = true;
        fs.rmSync(path, { recursive: true, force: true });
        setTimeout(async () => {
          reconnecting = false;
          await baileysServerInit();
        }, 3000);
      }
    });
  });
};
