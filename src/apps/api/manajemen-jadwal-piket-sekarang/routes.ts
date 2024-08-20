import { Router } from "express";
import { deletePiketHandler, generateSchedulerHandler, readAllPiketHandlers, recapResultHandler, updatePiketHandler } from "./handler";
import { auth } from "../../../middlewares/auth";

const router = Router();

router.get("/piket-sekarang", readAllPiketHandlers);
router.post("/generate-schedule-task", auth, generateSchedulerHandler);
router.post("/recap-task", auth, recapResultHandler);
router.put("/update/piket-sekarang", auth, updatePiketHandler);
router.delete("/delete-all-piket-sekarang", auth, deletePiketHandler);

export default router;
