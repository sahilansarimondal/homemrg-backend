import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", createUser);
router.get("/", getUsers);

export default router;
