"use client";

import type { ComponentType } from "react";
import { Archive, CalendarDays, Edit, Flag } from "lucide-react";
import { Badge } from "../common/Badges";
import { getNameInitials } from "@/lib/string";
import { getCategoryConfig, categoryConfig } from "@/constants/task";
import { TaskCategory } from "@/types/task.types";
import Button from "../common/Button";

export type MetaWithIcon = {
  label: string;
  textClass: string;
  bgClass: string;
  Icon?: ComponentType<{ className?: string }>;
};

type Props = {
  title: string;
  description: string | null;
  dueDateLabel: string;
  priorityLabel: string;
  priorityColorClass: string;
  statusMeta: MetaWithIcon;
  categoryMeta: MetaWithIcon;
  category: string;
};

export default function TaskDetailsMainSection({
  title,
  description,
  dueDateLabel,
  priorityLabel,
  priorityColorClass,
  statusMeta,
  categoryMeta,
  category,
}: Props) {
  const categoryData = getCategoryConfig(category);
  const firstLetter = getNameInitials(
    categoryConfig[category as TaskCategory]?.label || "U",
  );
  return (
    <section className="min-h-112 bg-white ">
      <div className="space-y-3 pt-5 px-5">
        <div className="flex justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${categoryMeta.textClass}`}
          >
            <Badge
              size="md"
              letter={firstLetter}
              variant="task"
              className={categoryData.dot}
            />
          </span>
          <div className="flex items-center gap-x-2.5">
            <Button value="Edit" icon={Edit} variant="outline">
              Edit
            </Button>
            <Button value="Archive" icon={Archive} variant="danger">
              Archive
            </Button>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${statusMeta.bgClass} ${statusMeta.textClass}`}
          >
            {statusMeta.Icon ? (
              <statusMeta.Icon className="h-3.5 w-3.5" />
            ) : null}
            {statusMeta.label}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700">
            <Flag className={`h-3.5 w-3.5 ${priorityColorClass}`} />
            {priorityLabel}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700">
            <CalendarDays className="h-3.5 w-3.5 text-zinc-500" />
            Due {dueDateLabel}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${categoryMeta.bgClass} ${categoryMeta.textClass}`}
          >
            {categoryMeta.Icon ? (
              <categoryMeta.Icon className="h-3.5 w-3.5" />
            ) : null}
            {categoryMeta.label}
          </span>
        </div>
      </div>

      <div className="mt-5 border-b border-[#E4E4E7]" />

      <div className="p-5">
        <h2 className="mb-2 text-sm font-semibold text-zinc-800">
          Description
        </h2>
        <p className="whitespace-pre-line text-sm leading-6 text-zinc-600">
          {description || "No description provided."}
        </p>
      </div>
    </section>
  );
}
