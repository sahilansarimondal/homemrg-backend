import { Router } from "express";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/user", userRoutes);

router.get("/test", (req, res) => {
  res.json({ message: "Test route working!" });
});

export default router;
