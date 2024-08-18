import { Router } from "express";
import { readAllHistorisPikektHandler } from "./handlers";

const router = Router();

router.get("/historis-piket", readAllHistorisPikektHandler);

export default router;
