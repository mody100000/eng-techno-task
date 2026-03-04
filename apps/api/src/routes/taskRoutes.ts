import { Router } from "express";
import {
  getAllTasks,
  createNewTask,
  getTaskByIdHandler,
  archiveTaskHandler,
} from "../controllers/tasksController.js";

const router: Router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskByIdHandler);
router.patch("/:id/archive", archiveTaskHandler);
router.post("/", createNewTask);

export default router;
