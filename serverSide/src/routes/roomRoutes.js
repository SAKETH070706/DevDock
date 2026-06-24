import express from "express";

import {createRoomController,joinRoomController,getRoomController,disbandRoomController,leaveRoomController} from "../controllers/roomController.js";
import { getHistoryController } from "../controllers/historyController.js";
import { updateLanguageController } from "../controllers/languageController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { saveCodeController } from "../controllers/saveCodeController.js";

const router=express.Router();

router.post("/create",authMiddleware,createRoomController);
router.post("/join",authMiddleware,joinRoomController);
router.get("/:roomId",authMiddleware,getRoomController);
router.delete("/:roomId",authMiddleware,disbandRoomController);
router.post("/leave",authMiddleware,leaveRoomController);
router.put("/:roomId/code",authMiddleware,saveCodeController);
router.get("/history/:roomId",authMiddleware,getHistoryController);
router.put("/:roomId/language",authMiddleware,updateLanguageController);

export default router;