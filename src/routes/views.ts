import { Router } from "express";
import { renderHomePage } from "../apps/frontend/home";

const router = Router();

router.use("/", renderHomePage);

export default router;
