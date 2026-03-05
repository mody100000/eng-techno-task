import type {
  TaskCategory,
  TaskStatus,
  TaskPriority,
} from "@/types/task.types";

export const statusConfig: Record<
  TaskStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  TODO: {
    label: "Backlog",
    dot: "bg-zinc-400",
    text: "text-zinc-500",
    bg: "bg-zinc-100",
  },
  BLOCKED: {
    label: "Blocked",
    dot: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-50",
  },
  DONE: {
    label: "Done",
    dot: "bg-green-500",
    text: "text-green-600",
    bg: "bg-green-50",
  },
};

export const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string }
> = {
  LOW: { label: "Low", color: "text-zinc-400" },
  MEDIUM: { label: "Medium", color: "text-yellow-500" },
  HIGH: { label: "High", color: "text-red-500" },
};

export const categoryConfig: Record<
  TaskCategory,
  { label: string; text: string; bg: string; dot: string }
> = {
  BACKEND: {
    label: "Backend",
    text: "text-blue-500",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  FRONTEND: {
    label: "Frontend",
    text: "text-red-500",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  DEVOBS: {
    label: "DevObs",
    text: "text-green-500",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  DESIGN: {
    label: "Design",
    text: "text-purple-500",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
  },
  TESTING: {
    label: "Testing",
    text: "text-yellow-500",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
};

// Safe getter for category from backend string
export function getCategoryConfig(category: string) {
  return categoryConfig[category as TaskCategory] || categoryConfig["BACKEND"];
}
