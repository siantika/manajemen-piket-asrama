import { Router } from "express";
import { registerAdmin } from "./daftar-admin-handler";

const router = Router();

router.post("/register-admin", registerAdmin);

export default router;
