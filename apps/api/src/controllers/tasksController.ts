import type { Request, Response } from "express";
import {
  getTasksWithPaginationAndFiltering,
  createTask,
  getTaskById,
  archiveTaskById,
  recordTaskActivity,
} from "../services/tasksService.js";
import { taskQuerySchema } from "../schemas/GetTasksSchema.js";
import { createTaskSchema } from "../schemas/CreateTaskSchema.js";
import { parseZodError } from "../utils/parseZodError.js";
import { TaskPriority } from "../generated/prisma/enums.js";
import { getCurrentUser } from "../utils/getCurrentUser.js";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const payload = {
      page: req.query.page,
      pageSize: req.query.pageSize,
      filter: {
        status: req.query.status,
        priority: req.query.priority,
        category: req.query.category,
        search: req.query.search,
        userAssigned: req.query.userAssigned,
      },
    };
    const parsed = taskQuerySchema.parse(payload);

    const filter = parsed.filter || {};
    const tasks = await getTasksWithPaginationAndFiltering(
      parsed.page,
      parsed.pageSize,
      filter,
    );
    res.json(tasks);
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};

export const createNewTask = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const parsed = createTaskSchema.parse(payload);

    // Parse dates if they're provided as strings
    const startDate = parsed.startDate
      ? new Date(parsed.startDate)
      : new Date();
    const dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;

    const user = await getCurrentUser();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const task = await createTask({
      title: parsed.title,
      description: parsed.description,
      status: parsed.status,
      priority: parsed.priority ?? TaskPriority.MEDIUM,
      category: parsed.category ?? null,
      startDate,
      dueDate,
      assignedTo: parsed.assignedToId
        ? { connect: { id: parsed.assignedToId } }
        : undefined,
      createdBy: { connect: { id: user.id } },
    } as any);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};

export const getTaskByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Task id is required" });
      return;
    }

    const task = await getTaskById(id as string);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(parseZodError(error));
  }
};

export const archiveTaskHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string" || !id.trim()) {
      res.status(400).json({ message: "Task id is required" });
      return;
    }

    const existingTask = await getTaskById(id);
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      res.status(500).json({ message: "Default user not found" });
      return;
    }

    const task = await archiveTaskById(id, currentUser.id);
    await recordTaskActivity(task.id, "Task archived", currentUser.id);

    res.status(200).json({
      message: "Task archived successfully",
      task,
    });
  } catch (error) {
    res.status(500).json(parseZodError(error));
  }
};
