import { Router } from "express";
import app from "../config/app-config";
import { renderHomePage } from "../apps/frontend/home";

const router = Router();

app.use("/", renderHomePage);

export default router;
