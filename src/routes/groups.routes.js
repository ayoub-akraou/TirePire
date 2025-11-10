import { Router } from "express";
import GroupController from "../controllers/GroupController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, GroupController.index);
router.get("/createdBy/:userId", authMiddleware, GroupController.getGroupsCreatedByUser);
router.post("/", authMiddleware, GroupController.store);
router.get("/:id", authMiddleware, GroupController.show);
// router.patch("/:id", authMiddleware, GroupController.update);
router.delete("/:id", authMiddleware, GroupController.destroy);

export default router;
