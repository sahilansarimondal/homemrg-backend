import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", createUser);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware are protected

router.get("/", getUsers);

export default router;
