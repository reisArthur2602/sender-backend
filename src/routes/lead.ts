import { Router } from "express";
import { getLeads } from "../functions/lead/get.js";

export const leadRoutes = Router();

leadRoutes.get("/", async (req, res) => {
  const leads = await getLeads();
  return res.status(200).json(leads);
});
