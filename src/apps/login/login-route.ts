import { Router } from "express";
import { loginAdminHandler } from "./login-handler";

const router = Router();

router.post("/login-admin", loginAdminHandler);

export default router;
