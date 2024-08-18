import { Router } from "express";
import { deletePiketHandler, readAllPiketHandlers, updatePiketHandler } from "./handler";
import { auth } from "../../../middlewares/auth";

const router = Router();

router.get("/piket-sekarang", readAllPiketHandlers);
router.put("/update/piket-sekarang", auth, updatePiketHandler);
router.delete("/delete-all-piket-sekarang", auth, deletePiketHandler);

export default router;
