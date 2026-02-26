import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import {
    loginAdminHandler,
    logoutAdminHandler,
    validateSessionHandler,
} from "./handlers";

const router = Router();

router.post("/login-admin", loginAdminHandler);
router.get("/session-admin", auth, validateSessionHandler);
router.post("/logout-admin", auth, logoutAdminHandler);

export default router;
