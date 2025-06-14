import { Router } from "express";
import {
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { verifyEmail } from "../controllers/user.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware are protected

router.get("/me", getCurrentUser);

export default router;
