import express from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, authorize("Admin"), createTask).get(protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, authorize("Admin"), deleteTask);

export default router;
