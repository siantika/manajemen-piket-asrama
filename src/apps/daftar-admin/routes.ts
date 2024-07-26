import { Router } from "express";
import { registerAdmin } from "./handlers";

const router = Router();

router.post("/register-admin", registerAdmin);

export default router;
