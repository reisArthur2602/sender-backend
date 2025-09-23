import fs from "fs";
import path from "path";

export const ensurePath = (instanceId: string) => {
  const instancePath = path.join("./auth", instanceId);

  if (!fs.existsSync(instancePath))
    fs.mkdirSync(instancePath, { recursive: true });

  return instancePath;
};
