import type { Boom } from "@hapi/boom";
import {
  DisconnectReason,
  type WAConnectionState,
} from "@whiskeysockets/baileys";
import fs from "fs";
import qrCodeTerminal from "qrcode-terminal";
import { baileysServerInit } from "./index.js";
import { ensurePath } from "./ensure-path.js";

type Connection = WAConnectionState | undefined;

type LastDisconnect =
  | {
      error: Error | Boom<any> | undefined;
    }
  | undefined;

type Props = {
  connection: Connection;
  lastDisconnect: LastDisconnect;
  instanceId: string;
  qr: string | undefined;
};

type Status = "connecting" | "connected" | "pending";

export const processConnection = async ({
  connection,
  lastDisconnect,
  qr,
  instanceId,
}: Props) => {
  let status: Status = "pending";
  const path = ensurePath(instanceId);

  if (qr) {
    qrCodeTerminal.generate(qr, { small: true });
    status = "pending";
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
};
