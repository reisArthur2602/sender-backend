import { Router } from "express";
import { createMenu } from "../functions/menu/create.js";
import { createMenuSchema } from "../zod/menu/create-menu-schema.js";

const menuRoutes = Router();

menuRoutes.post("/create", async (req, res) => {
  const data = createMenuSchema.parse(req.body);
  await createMenu(data);
  return res.sendStatus(201);
});

export default menuRoutes;
