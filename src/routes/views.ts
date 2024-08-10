import { Router } from "express";
import { renderHomePage } from "../apps/frontend/home";
import { renderLoginAdmin } from "../apps/frontend/login-admin/login-admin";
import { loginAdminHandler } from "../apps/frontend/login-admin/handlers";
import { renderDashboardAdmin } from "../apps/frontend/dashboard/dashboard";

const router = Router();

router.get("/", renderHomePage);
router.get("/login-admin", renderLoginAdmin);
router.get("/dashboard-admin", renderDashboardAdmin);
router.post("/login", loginAdminHandler);

export default router;
