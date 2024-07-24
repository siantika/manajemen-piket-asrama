import { Router } from "express";
import {
  addMemberHandler,
  updateMemberHandler,
  deleteMemberHandler,
  readAllMemberHandler,
} from "./manajemen-piket.handler";

const router = Router();

router.post("/members", addMemberHandler);
router.get("/members", readAllMemberHandler);
router.put("/members", updateMemberHandler);
router.delete("/members/:memberId", deleteMemberHandler);

export default router;
