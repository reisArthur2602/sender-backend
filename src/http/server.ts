import "dotenv/config";

import app from "./app.js";
import { baileysServerInit } from "../baileys/index.js";

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, async () => {
  console.log(`👽 Server rodando na Porta:${PORT}`);
  await baileysServerInit("f80336a5-322f-48c0-8199-6e3ddba6705e");
});
