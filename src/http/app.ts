import express from "express";
import cors from "cors";
import menuRoutes from "../routes/menu.js";
import { handlerErrorsPlugin } from "./plugins/errors.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/menu", menuRoutes);

app.use(handlerErrorsPlugin);
export default app;
