import "dotenv/config";

import http from "http";
import app from "./app.js";

import { baileysServerInit } from "../baileys/index.js";
import { Server } from "socket.io";
import { BETTER_AUTH_APP } from "../utils/constants.js";

const PORT = Number(process.env.PORT) || 4242;

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", async () => {
  console.log(`👽 Server rodando na Porta:${PORT}`);
  await baileysServerInit();
});

export const socket = new Server(server, {
  cors: {
    origin: BETTER_AUTH_APP,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 60000,

  allowEIO3: true,
  transports: ["websocket"],
});
