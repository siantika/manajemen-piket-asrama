import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { readAllHistorisPikektHandler } from "./handlers";

const router = Router();

router.get("/historis-piket", auth, readAllHistorisPikektHandler);

export default router;
