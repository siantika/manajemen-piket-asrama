import { Router } from "express";
import manajemenPiketRoutes from "../apps/api/manajemen-piket/routes";
import daftarAdminRoute from "../apps/api/daftar-admin/routes";
import loginRoute from "../apps/api/login/routes";

const router = Router();
const api_ver = process.env.API_VER || "v1";

router.use(api_ver, manajemenPiketRoutes);
router.use(api_ver, daftarAdminRoute);
router.use(api_ver, loginRoute);

export default router;
