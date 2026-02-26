import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { deletePiketHandler, generateSchedulerHandler, readAllPiketHandlers, recapResultHandler, updatePiketHandler } from "./handler";

const router = Router();

router.get("/piket-sekarang", auth, readAllPiketHandlers);
router.post("/generate-schedule-task", auth, generateSchedulerHandler);
router.post("/recap-task", auth, recapResultHandler);
router.put("/update/piket-sekarang", auth, updatePiketHandler);
router.delete("/delete-all-piket-sekarang", auth, deletePiketHandler);

export default router;
