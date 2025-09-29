import express from "express";
import cors from "cors";
import menuRoutes from "../routes/menu.js";
import { handlerErrorsPlugin } from "./plugins/errors.js";
import { leadRoutes } from "../routes/lead.js";
import { dashboardRoutes } from "../routes/dashboard.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/menu", menuRoutes);
app.use("/lead", leadRoutes);
app.use("/dashboard", dashboardRoutes);

app.use("/api/auth", toNodeHandler(auth));

app.use(handlerErrorsPlugin);

export default app;
