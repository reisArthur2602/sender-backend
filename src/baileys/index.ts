import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { ensurePath } from "./helpers/ensure-path.js";
import { processMessage } from "./process-message.js";
import { normalizeMessage } from "./helpers/normalize-message.js";
import qrCodeTerminal from "qrcode-terminal";
import fs from "fs";

import { socket } from "../http/server.js";
import type { Boom } from "@hapi/boom";

type Status = "connecting" | "connected" | "pending";

export const baileysServerInit = async (instanceId: string) => {
  const path = ensurePath(instanceId);

  const { state, saveCreds } = await useMultiFileAuthState(path);
  const sockWA = makeWASocket({ auth: state });

  let status: Status = "pending";
  let qrCode: string | null = null;

  sockWA.ev.on(
    "connection.update",
    async ({ connection, lastDisconnect, qr }) => {
      const path = ensurePath(instanceId);

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

          if (reason === DisconnectReason.loggedOut)
            fs.rmSync(path, { recursive: true, force: true });

          await baileysServerInit(instanceId);

          break;
        }
      }

      socket.emit("connection.status", { status, qr: qrCode });
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

  socket.on("connection", (client) => {
    client.emit("connection.status", { status, qr: qrCode });

    client.on("session.disconnect", async () => {
      fs.rmSync(path, { recursive: true, force: true });
      await baileysServerInit(instanceId);
    });
  });
};
