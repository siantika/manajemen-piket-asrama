import { Router } from "express";
import { deletePiketHandler, updatePiketHandler } from "./handler";
import { auth } from "../../../middlewares/auth";

const router = Router();

router.put("/update/piket-sekarang", auth, updatePiketHandler);
router.delete("/delete-all-piket-sekarang", auth, deletePiketHandler);

export default router;
