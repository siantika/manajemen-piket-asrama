import { Router } from "express";
import {
  addMemberHandler,
  updateMemberHandler,
  deleteMemberHandler,
  readAllMemberHandler,
  addPlaceHandler,
  readAllPlacesHandler,
  updatePlaceHandler,
  deletePlaceHandler,
} from "./handlers";
import { auth } from "../../../middlewares/auth";

const router = Router();

router.post("/members", auth, addMemberHandler);
router.get("/members", readAllMemberHandler);
router.put("/members", auth, updateMemberHandler);
router.delete("/members/:memberId", auth, deleteMemberHandler);

router.post("/places", auth, addPlaceHandler);
router.get("/places", readAllPlacesHandler);
router.put("/places", auth, updatePlaceHandler);
router.delete("/places/:placeId", auth, deletePlaceHandler);

export default router;
