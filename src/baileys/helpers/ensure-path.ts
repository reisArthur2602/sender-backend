import fs from "fs";
import path from "path";

export const ensurePath = (token: string) => {
  const tokenPath = path.join("./auth", token);

  if (!fs.existsSync(tokenPath)) fs.mkdirSync(tokenPath, { recursive: true });

  return tokenPath;
};
