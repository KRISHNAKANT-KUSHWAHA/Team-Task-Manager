import express from "express";
import {
  addMember,
  createProject,
  getProjects,
  removeMember
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, authorize("Admin"), createProject).get(protect, getProjects);
router.put("/:id/add-member", protect, authorize("Admin"), addMember);
router.delete("/:id/remove-member", protect, authorize("Admin"), removeMember);

export default router;
