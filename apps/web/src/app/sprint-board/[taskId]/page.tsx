"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import {
  categoryOptions,
  getCategoryConfig,
  priorityConfig,
  statusConfig,
  statusOptions,
} from "@/constants/task";
import type { Task, TaskCategory, TaskStatus } from "@/types/task.types";
import TaskDetailsMainSection from "@/components/task-details/MainSection";
import TaskDetailsSidebar from "@/components/task-details/TaskDetailsSidebar";
import TaskDetailsCommentsSection from "@/components/task-details/Comments";
import type {
  TimelineFilter,
  TimelineItem,
} from "@/components/task-details/Comments";
import { getNameInitials } from "@/lib/string";

type TaskDetails = Task & {
  assignedTo?: { id: string; name: string | null } | null;
  createdBy?: { id: string; name: string | null } | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
const currentUser = {
  name: "Mody Ahmed",
};

function formatDate(date: string | null, withTime = false) {
  if (!date) return "—";
  return withTime
    ? moment.utc(date).format("MMM D, YYYY • HH:mm")
    : moment.utc(date).format("MMM D, YYYY");
}

export default function TaskDetailsPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = params?.taskId;

  const [task, setTask] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("ALL");
  const [comment, setComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      setError("Task id is missing");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch task");
        }
        return data;
      })
      .then((data) => {
        setTask(data as TaskDetails);
      })
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [taskId]);

  useEffect(() => {
    if (!taskId) {
      setTimelineLoading(false);
      setTimelineError("Task id is missing");
      return;
    }

    const controller = new AbortController();
    setTimelineLoading(true);
    setTimelineError(null);

    fetch(`${API_BASE_URL}/api/comments/task/${taskId}/timeline`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch timeline");
        }
        return data;
      })
      .then((items) => {
        const mapped: TimelineItem[] = (items || []).map(
          (item: {
            type: "comment" | "activity";
            id: string;
            datetime: string;
            message?: string;
            action?: string;
            createdBy?: { name: string | null } | null;
            performedBy?: { name: string | null } | null;
          }) => {
            if (item.type === "activity") {
              return {
                type: "activity",
                id: item.id,
                datetime: item.datetime,
                action: item.action || "updated task",
                actorName: item.performedBy?.name || "Unknown user",
              };
            }
            return {
              type: "comment",
              id: item.id,
              datetime: item.datetime,
              message: item.message || "",
              actorName: item.createdBy?.name || "Unknown user",
            };
          },
        );
        setTimelineItems(mapped);
      })
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") {
          setTimelineError(fetchError.message);
        }
      })
      .finally(() => setTimelineLoading(false));

    return () => controller.abort();
  }, [taskId]);

  const statusMeta = useMemo(() => {
    if (!task) return null;
    const option = statusOptions.find((item) => item.value === task.status);
    return {
      label: statusConfig[task.status as TaskStatus].label,
      textClass: statusConfig[task.status as TaskStatus].text,
      bgClass: statusConfig[task.status as TaskStatus].bg,
      Icon: option?.icon,
    };
  }, [task]);

  const categoryMeta = useMemo(() => {
    if (!task) return null;
    const normalizedCategory = task.category as TaskCategory;
    const config = getCategoryConfig(task.category);
    const option = categoryOptions.find(
      (item) => item.value === normalizedCategory,
    );

    return {
      label: config.label,
      textClass: config.text,
      bgClass: config.bg,
      Icon: option?.icon,
    };
  }, [task]);

  const filteredTimelineItems = useMemo(() => {
    if (timelineFilter === "COMMENTS") {
      return timelineItems.filter((item) => item.type === "comment");
    }
    if (timelineFilter === "ACTIVITY") {
      return timelineItems.filter((item) => item.type === "activity");
    }
    return timelineItems;
  }, [timelineFilter, timelineItems]);

  const firstLetter = getNameInitials(currentUser.name);
  //optimistic update
  const handleCreateComment = async () => {
    if (!taskId || !comment.trim()) return;

    // 1. Save previous state for rollback
    const previousItems = timelineItems;

    // 2. Create a temp item and add it immediately
    const optimisticItem: TimelineItem = {
      type: "comment",
      id: `temp-${Date.now()}`,
      datetime: new Date().toISOString(),
      message: comment.trim(),
      actorName: currentUser.name,
    };
    setTimelineItems((prev) => [...prev, optimisticItem]);
    setComment("");

    try {
      setCommentSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, message: optimisticItem.message }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.message || "Failed to create comment");

      const timelineRes = await fetch(
        `${API_BASE_URL}/api/comments/task/${taskId}/timeline`,
      );
      const timelineData = await timelineRes.json();
      setTimelineItems(timelineData);
    } catch (submitError) {
      // 4. Roll back on failure
      setTimelineItems(previousItems);
      setComment(optimisticItem.message);
      setTimelineError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create comment",
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#FAFAFA] px-6">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#7C3AED] border-t-transparent" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-[#FAFAFA] px-6 py-8">
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Task not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="grid lg:grid-cols-[1fr_300px] lg:items-start relative">
        <div>
          <TaskDetailsMainSection
            title={task.title}
            description={task.description}
            dueDateLabel={formatDate(task.dueDate)}
            priorityLabel={priorityConfig[task.priority].label}
            priorityColorClass={priorityConfig[task.priority].color}
            statusMeta={{
              label: statusMeta?.label || "—",
              textClass: statusMeta?.textClass || "text-zinc-600",
              bgClass: statusMeta?.bgClass || "bg-zinc-100",
              Icon: statusMeta?.Icon,
            }}
            categoryMeta={{
              label: categoryMeta?.label || "—",
              textClass: categoryMeta?.textClass || "text-zinc-600",
              bgClass: categoryMeta?.bgClass || "bg-zinc-100",
              Icon: categoryMeta?.Icon,
            }}
            category={task.category}
          />
          <TaskDetailsCommentsSection
            timelineItems={filteredTimelineItems}
            timelineLoading={timelineLoading}
            timelineError={timelineError}
            timelineFilter={timelineFilter}
            onTimelineFilterChange={setTimelineFilter}
            commentValue={comment}
            onCommentChange={setComment}
            onCommentSubmit={handleCreateComment}
            commentSubmitting={commentSubmitting}
            currentUserFirstLetter={firstLetter}
          />
        </div>

        <TaskDetailsSidebar
          status={task.status}
          priority={task.priority}
          assigneeLabel={
            task.assignedTo?.name || task.assignedToId || "Unassigned"
          }
          category={task.category}
          startDateLabel={formatDate(task.startDate)}
          dueDateLabel={formatDate(task.dueDate)}
          createdAtLabel={formatDate(task.createdAt, true)}
          updatedAtLabel={formatDate(task.updatedAt, true)}
          createdByLabel={task.createdBy?.name || task.createdById}
        />
      </div>
    </div>
  );
}
