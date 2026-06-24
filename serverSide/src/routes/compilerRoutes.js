import express from "express";
import { runCodeController } from "../controllers/compilerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/run",authMiddleware,runCodeController);

export default router;