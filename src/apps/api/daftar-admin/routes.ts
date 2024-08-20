import { Router } from "express";
import { registerAdmin } from "./handlers";
import { auth } from "../../../middlewares/auth";

const router = Router();

router.post("/register-admin", auth, registerAdmin);

export default router;
