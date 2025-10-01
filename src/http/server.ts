import "dotenv/config";

import http from "http";
import app from "./app.js";

import { baileysServerInit } from "../baileys/index.js";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT) || 4242;

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", async () => {
    console.log(`👽 Server rodando na Porta:${PORT}`);
    await baileysServerInit();
});

const mode = process.env.NODE_ENV || "development";

export const socket = new Server(server, {
    cors: {
        credentials: true,
        origin:
            mode === "development"
                ? "http://localhost:5173"
                : process.env.BETTER_AUTH_URL_APP,
    },
});
