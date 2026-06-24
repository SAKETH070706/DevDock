import express from "express";

import {
    sendOTPController,
    resendOTPController,
    verifyOTPController,
    registerController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    getCurrentUser
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router=express.Router();

router.post("/send-otp",sendOTPController);
router.post("/resend-otp",resendOTPController);
router.post("/verify-otp", verifyOTPController);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password",forgotPasswordController);
router.post("/reset-password",resetPasswordController);
router.get("/me",authMiddleware,getCurrentUser);
export default router;
