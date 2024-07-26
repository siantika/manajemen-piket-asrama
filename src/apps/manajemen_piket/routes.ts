import { Router } from "express";
import {
  addMemberHandler,
  updateMemberHandler,
  deleteMemberHandler,
  readAllMemberHandler,
} from "./manajemen-piket.handler";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/members", auth, addMemberHandler);
router.get("/members", readAllMemberHandler);
router.put("/members", auth, updateMemberHandler);
router.delete("/members/:memberId", auth, deleteMemberHandler);

export default router;
