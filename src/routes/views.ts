import { Router } from "express";
import { renderHomePage } from "../apps/frontend/home";
import { renderLoginAdmin } from "../apps/frontend/login-admin/login-admin";
import { loginAdminHandler } from "../apps/frontend/login-admin/handlers";


const router = Router();

router.get("/", renderHomePage);
router.get("/login-admin", renderLoginAdmin);
router.post("/login", loginAdminHandler);

export default router;
