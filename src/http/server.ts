import "dotenv/config";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`👽 Server rodando na Porta:${PORT}`);
});
