import { Router } from "express";
import CycleController from "../controllers/CycleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/:group_id", authMiddleware, CycleController.index);
router.post("/:group_id", authMiddleware, CycleController.store);
router.post("/start-cycle/:group_id", authMiddleware, CycleController.startCycle);
// router.patch("/:id", authMiddleware, CycleController.update);
// router.delete("/:group_id", authMiddleware, CycleController.destroy);

export default router;
