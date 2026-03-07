"use client";

import { Flag, User, MoreVertical } from "lucide-react";
import type { Task, TaskCategory } from "@/types/task.types";
import { useRouter } from "next/navigation";

import moment from "moment";
import { getNameInitials, truncateText } from "@/lib/string";
import {
  priorityConfig,
  getCategoryConfig,
  categoryConfig,
} from "@/constants/task";
import { Badge } from "../common/Badges";

function formatDate(date: string | null) {
  if (!date) return <span className="text-zinc-300">—</span>;
  const formatted = moment.utc(date).format("MMM D");
  return <span className="text-zinc-500">{formatted}</span>;
}

export default function TaskRow({ task }: { task: Task }) {
  const router = useRouter();
  const priority = priorityConfig[task.priority]!;
  const category = getCategoryConfig(task.category);
  const firstLetter = getNameInitials(
    categoryConfig[task.category as TaskCategory]?.label || "U",
  );

  const openTaskDetails = () => {
    router.push(`/sprint-board/${task.id}`);
  };

  return (
    <tr
      className="group cursor-pointer border-b border-[#F4F4F5] bg-white transition-colors hover:bg-[#EDE9FE98]"
      onClick={openTaskDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openTaskDetails();
        }
      }}
      tabIndex={0}
      aria-label={`Open task ${task.title}`}
    >
      {/* Title */}
      <td className="py-2.5 pl-4 pr-3">
        <div className="flex items-center gap-2.5">
          {/* Checkbox */}
          <input
            type="checkbox"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-zinc-300 accent-[#7C3AED]"
          />
          <div className="flex items-center gap-2">
            <Badge
              size="sm"
              letter={firstLetter}
              variant="task"
              className={category.dot}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#09090B]">
                {task.title}
              </span>
              <span className="text-xs text-[#A1A1AA]">
                {truncateText(task.description)}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Assignee */}
      <td className="px-3 py-2.5">
        {task?.assignedTo ? (
          <Badge
            letter={getNameInitials(task.assignedTo.name || task.assignedTo.id)}
            size="sm"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-300">
            <User className="h-3 w-3" />
          </div>
        )}
      </td>

      {/* Priority */}
      <td className="px-3 py-2.5">
        <div className={"flex items-center gap-1.5 text-xs font-medium"}>
          <Flag className={`h-3.5 w-3.5 ${priority.color}`} />
          <span className="hidden sm:inline text-[#3F3F46] text-sm font-normal">
            {priority.label}
          </span>
        </div>
      </td>

      {/* Start */}
      <td className="hidden px-3 py-2.5 text-xs md:table-cell">
        {formatDate(task.startDate)}
      </td>

      {/* Due */}
      <td className="hidden px-3 py-2.5 text-xs md:table-cell">
        {formatDate(task.dueDate)}
      </td>

      {/* Category */}
      <td className="hidden px-3 py-2.5 lg:table-cell">
        <span
          className={`rounded-md ${category.bg} px-2 py-0.5 text-xs font-medium capitalize ${category.text}`}
        >
          {task.category ? task.category : "Uncategorized"}
        </span>
      </td>

      {/* Row actions — appear on hover */}
      <td className="py-2.5 pr-3 text-right">
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-600 "
        >
          <MoreVertical className="h-4.5 w-4.5" />
        </button>
      </td>
    </tr>
  );
}
