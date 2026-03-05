import { z } from "zod";
import { TaskPriority, TaskStatus } from "../generated/prisma/enums.js";

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).default(10),
  filter: z
    .object({
      status: z.enum(Object.values(TaskStatus)).optional(),
      priority: z.enum(Object.values(TaskPriority)).optional(),
      search: z.string().optional(),
      userAssigned: z.string().optional(),
    })
    .optional(),
});
