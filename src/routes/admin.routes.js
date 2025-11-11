import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { AdminController } from "../controllers/AdminController.js";

const router = Router();
router.post("/memberships/accept", authMiddleware, AdminController.accept);
router.post("/memberships/reject", authMiddleware, AdminController.reject);

export default router;