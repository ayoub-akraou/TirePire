import { Router } from "express";
import MembershipController from "../controllers/MembershipController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/", authMiddleware, MembershipController.index);
router.post("/", authMiddleware, MembershipController.store);
router.get("/:id", authMiddleware, MembershipController.show);
router.delete("/:id", authMiddleware, MembershipController.destroy);

export default router;