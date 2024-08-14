import { Router } from "express";
import { updatePiketHandler } from "./handler";
import { auth } from "../../../middlewares/auth";

const router = Router();

router.put("/update/piket-sekarang", auth, updatePiketHandler);

export default router;
