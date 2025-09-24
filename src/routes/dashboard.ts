import { Router } from "express";
import { getTotalMessages } from "../functions/message/get-total.js";
import { getTotalMenus } from "../functions/menu/getTotal.js";
import { getTotalLeads } from "../functions/lead/getTotal.js";
import { getRecentMessages } from "../functions/message/get-recent.js";
import { getTopUsageMenu } from "../functions/menu/get-top-usage.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", async (req, res) => {
  const totalMessagesCount = await getTotalMessages();
  const totalMenusCount = await getTotalMenus();
  const totalLeadsCount = await getTotalLeads();
  const recentMessages = await getRecentMessages();
  const topUsageTags = await getTopUsageMenu();

  return res.status(200).json({
    totalMessagesCount,
    totalMenusCount,
    totalLeadsCount,
    recentMessages,
    topUsageTags,
  });
});
