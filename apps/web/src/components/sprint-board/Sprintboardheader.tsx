"use client";

import {
  Calendar,
  Activity,
  LayoutList,
  Kanban,
  Clock,
  Plus,
  Search,
  MoreVertical,
} from "lucide-react";
import Button from "@/components/common/Button";
import type { TaskPriority, TaskStatus } from "@/types/task.types";

const views = [
  { label: "List", icon: LayoutList },
  { label: "Board", icon: Kanban },
  { label: "Calendar", icon: Calendar },
  { label: "Timeline", icon: Clock },
  { label: "Activity", icon: Activity },
];

type Props = {
  onAddTask?: () => void;
  activeView?: string;
  search: string;
  onSearchChange: (value: string) => void;
  status: "ALL" | TaskStatus;
  onStatusChange: (value: "ALL" | TaskStatus) => void;
  priority: "ALL" | TaskPriority;
  onPriorityChange: (value: "ALL" | TaskPriority) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
};

export default function SprintBoardHeader({
  onAddTask,
  activeView = "List",
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  return (
    <div>
      <div className="border-b border-[#E4E4E7] bg-[##FAFAFA]">
        {/* Top row — title + actions */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h1 className="text-2xl font-bold text-[#09090B]">Spring Board</h1>
          <div className="flex items-center gap-2">
            <Button icon={Plus} size="lg" onClick={onAddTask}>
              New Task
            </Button>
            <MoreVertical color="#A1A1AA" />
          </div>
        </div>

        {/* Views + Filters row */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto px-6 pb-0 scrollbar-none">
          {/* View tabs */}
          <div className="flex items-center gap-0.5">
            {views.map(({ label, icon: Icon }) => {
              const isActive = label === activeView;
              return (
                <button
                  key={label}
                  type="button"
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition whitespace-nowrap
                  ${
                    isActive
                      ? "border-[#7C3AED] text-[#7C3AED]"
                      : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex justify-between px-6 pt-4 pb-1">
        <div className="flex items-center gap-2 ">
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as "ALL" | TaskStatus)
            }
            className="h-8 rounded-lg border border-[#E4E4E7] bg-white px-2 text-xs font-medium text-zinc-700 focus:outline-none"
          >
            <option value="ALL">All status</option>
            <option value="TODO">Backlog</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="DONE">Done</option>
          </select>

          <select
            value={priority}
            onChange={(e) =>
              onPriorityChange(e.target.value as "ALL" | TaskPriority)
            }
            className="h-8 rounded-lg border border-[#E4E4E7] bg-white px-2 text-xs font-medium text-zinc-700 focus:outline-none"
          >
            <option value="ALL">All priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-[#E4E4E7] bg-white px-2 text-xs font-medium text-zinc-700 focus:outline-none"
          >
            <option value={3}>3 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
        <label className="flex h-8 items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-2.5">
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks"
            className="w-40 border-0 bg-transparent text-xs text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}
