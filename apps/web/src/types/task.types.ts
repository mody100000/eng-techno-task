export type TaskStatus = "IN_PROGRESS" | "TODO" | "BLOCKED" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskCategory =
  | "BACKEND"
  | "FRONTEND"
  | "DEVOBS"
  | "DESIGN"
  | "TESTING";
export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  assignedToId: string | null;
  archivedById: string | null;
};
