import { Router } from "express";
import manajemenPiketRoutes from "../apps/api/manajemen-piket/routes";
import daftarAdminRoute from "../apps/api/daftar-admin/routes";
import loginRoute from "../apps/api/login/routes";
import piketSekarangRoute from "../apps/api/manajemen-jadwal-piket-sekarang/routes";
import CONST from "../config/consts";

const router = Router();

router.use(CONST.API_VERSION, manajemenPiketRoutes);
router.use(CONST.API_VERSION, daftarAdminRoute);
router.use(CONST.API_VERSION, loginRoute);
router.use(CONST.API_VERSION, piketSekarangRoute);

export default router;
