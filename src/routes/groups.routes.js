import { Router } from "express";
import GroupController from "../controllers/GroupController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, GroupController.index);
router.get("/created", authMiddleware, GroupController.getGroupsCreatedByUser);
router.get("/membered/", authMiddleware, GroupController.getGroupsMemberedByUser);
router.post("/", authMiddleware, GroupController.store);
router.get("/:id", authMiddleware, GroupController.show);
router.get("/:id/members", authMiddleware, GroupController.getMembers);
router.delete("/:id", authMiddleware, GroupController.destroy);

export default router;
