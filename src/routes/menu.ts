import { Router } from "express";
import { createMenu } from "../functions/menu/create.js";
import { createMenuSchema } from "../zod/menu/create-menu-schema.js";
import { getMenus } from "../functions/menu/get.js";
import { deleteMenuSchema } from "../zod/menu/delete-menu-schema.js";
import { deleteMenu } from "../functions/menu/delete.js";

const menuRoutes = Router();

menuRoutes.post("/create", async (req, res) => {
  const data = createMenuSchema.parse(req.body);
  await createMenu(data);
  return res.sendStatus(201);
});

menuRoutes.get("/", async (req, res) => {
  const menus = await getMenus();
  return res.status(200).json({ menus });
});

menuRoutes.delete("/:menuId", async (req, res) => {
  const data = deleteMenuSchema.parse(req.params);
  await deleteMenu(data.menuId);
  return res.sendStatus(204);
});

export default menuRoutes;
