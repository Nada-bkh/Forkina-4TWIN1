import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);
router.post("/logout", authController.checkTokenValidity, authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);

export default router;
