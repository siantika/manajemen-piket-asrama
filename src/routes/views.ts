import { Router } from "express";
import { renderHomePage } from "../apps/frontend/home";
import { renderLoginAdmin } from "../apps/frontend/login-admin";

const router = Router();

router.get("/", renderHomePage);
router.get("/login-admin", renderLoginAdmin);

export default router;
