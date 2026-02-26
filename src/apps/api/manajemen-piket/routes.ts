import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import {
    addMemberHandler,
    addPlaceHandler,
    deleteMemberHandler,
    deletePlaceHandler,
    readAllMemberHandler,
    readAllPlacesHandler,
    updateMemberHandler,
    updatePlaceHandler,
} from "./handlers";

const router = Router();

router.post("/members", auth, addMemberHandler);
router.get("/members", auth, readAllMemberHandler);
router.put("/members", auth, updateMemberHandler);
router.delete("/members/:memberId", auth, deleteMemberHandler);

router.post("/places", auth, addPlaceHandler);
router.get("/places", auth, readAllPlacesHandler);
router.put("/places", auth, updatePlaceHandler);
router.delete("/places/:placeId", auth, deletePlaceHandler);

export default router;
