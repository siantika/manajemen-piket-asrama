import { Router } from "express";
import { renderHomePage } from "../apps/frontend/home";
import { renderLoginAdmin } from "../apps/frontend/login-admin/login-admin";
import {
  renderDashboardAdmin,
  renderManajemenOrang,
  renderManajemenPiketSekarang,
  renderManajemenTempat,
} from "../apps/frontend/dashboard/dashboard";

const router = Router();

router.get("/", renderHomePage);
router.get("/login-admin", renderLoginAdmin);
router.get("/dashboard-admin", renderDashboardAdmin);
router.post("/login", renderLoginAdmin);
router.get("/manajemen-orang", renderManajemenOrang);
router.get("/manajemen-tempat", renderManajemenTempat);
router.get("/manajemen-piket", renderManajemenPiketSekarang);

export default router;
