import { Router } from "express";
import manajemenPiketRoutes from "../apps/api/manajemen-piket/routes";
import daftarAdminRoute from "../apps/api/daftar-admin/routes";
import loginRoute from "../apps/api/login/routes";
import CONST from "../config/consts";

const router = Router();

router.use(CONST.API_VERSION, manajemenPiketRoutes);
router.use(CONST.API_VERSION, daftarAdminRoute);
router.use(CONST.API_VERSION, loginRoute);

export default router;
