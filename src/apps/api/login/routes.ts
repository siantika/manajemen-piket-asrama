import { Router } from "express";
import { loginAdminHandler } from "./handlers";

const router = Router();

router.post("/login-admin", loginAdminHandler);

export default router;
