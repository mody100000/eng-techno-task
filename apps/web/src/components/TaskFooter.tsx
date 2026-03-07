"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "./common/Badges";
import { statusConfig } from "@/constants/task";
import type { Task, TaskStatus } from "@/types/task.types";
import { API_BASE_URL } from "@/utils/api";

const STATUS_ORDER: TaskStatus[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "BACKLOG",
  "DONE",
];

const defaultCounts: Record<TaskStatus, number> = {
  BACKLOG: 0,
  IN_PROGRESS: 0,
  BLOCKED: 0,
  DONE: 0,
};

export default function TaskFooter() {
  const [counts, setCounts] = useState(defaultCounts);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadTaskStats() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks?pageSize=100`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        const tasks: Task[] = data.tasks ?? [];

        const nextCounts = { ...defaultCounts };

        tasks.forEach((task) => {
          nextCounts[task.status]++;
        });

        setCounts(nextCounts);
        setTotal(tasks.length);
      } catch {
        setCounts(defaultCounts);
        setTotal(0);
      }
    }

    loadTaskStats();
  }, []);

  return (
    <footer className="flex items-center justify-between border-t border-[#E4E4E7] bg-white px-4 py-3 sm:px-6">
      <span className="text-sm text-[#71717A]">{total} Tasks</span>

      <div className="flex items-center gap-2 sm:gap-4">
        {STATUS_ORDER.map((status) => (
          <StatusBadge
            key={status}
            count={counts[status]}
            label={statusConfig[status].label}
            dotClass={statusConfig[status].dot}
            textClass={statusConfig[status].text}
          />
        ))}
      </div>
    </footer>
  );
}
