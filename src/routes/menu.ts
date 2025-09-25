import { Router } from "express";
import { createMenu } from "../functions/menu/create.js";
import { createMenuSchema } from "../zod/menu/create-menu-schema.js";
import { getMenus } from "../functions/menu/get.js";
import { deleteMenu } from "../functions/menu/delete.js";
import { updateMenu } from "../functions/menu/update.js";
import { updateMenuSchema } from "../zod/menu/update-menu-schema.js";
import { updateStatusMenu } from "../functions/menu/update-status.js";

const menuRoutes = Router();

menuRoutes.post("/create", async (req, res) => {
  const data = createMenuSchema.parse(req.body);
  await createMenu(data);
  return res.sendStatus(201);
});

menuRoutes.get("/", async (req, res) => {
  const menus = await getMenus();
  return res.status(200).json(menus);
});

menuRoutes.delete("/:menuId", async (req, res) => {
  const { menuId } = req.params;
  await deleteMenu(menuId);
  return res.sendStatus(204);
});

menuRoutes.put("/:menuId", async (req, res) => {
  const { menuId } = req.params;
  const data = updateMenuSchema.parse(req.body);
  await updateMenu({ ...data, id: menuId });
  return res.sendStatus(204);
});

menuRoutes.patch("/status/:menuId", async (req, res) => {
  const { menuId } = req.params;

  await updateStatusMenu(menuId);
  return res.sendStatus(204);
});

export default menuRoutes;
