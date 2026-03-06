"use client";

import { useEffect, useState } from "react";
import SprintBoardHeader from "@/components/sprint-board/Sprintboardheader";
import TaskGroup from "@/components/sprint-board/Taskgroup";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/types/task.types";
import Button from "@/components/common/Button";
import { SearchX } from "lucide-react";
import TaskFooter from "@/components/TaskFooter";
import CreateTaskModal from "@/components/sprint-board/CreateTaskModal";
import { TaskGroupSkeleton } from "@/components/common/TaskGroupSkeleton";

const STATUS_ORDER: TaskStatus[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "BACKLOG",
  "DONE",
];
const API_BASE_URL = "http://localhost:5000";

export default function SprintBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | TaskPriority>(
    "ALL",
  );
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | TaskCategory>(
    "ALL",
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (statusFilter !== "ALL") {
      params.set("status", statusFilter);
    }
    if (priorityFilter !== "ALL") {
      params.set("priority", priorityFilter);
    }
    if (categoryFilter !== "ALL") {
      params.set("category", categoryFilter);
    }
    if (search) {
      params.set("search", search);
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/tasks?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch tasks");
        }
        return data;
      })
      .then((data) => {
        setTasks(data.tasks ?? []);
        setTotalPages(Math.max(data.totalPages ?? 1, 1));
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [
    page,
    pageSize,
    statusFilter,
    priorityFilter,
    categoryFilter,
    search,
    refreshKey,
  ]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, categoryFilter, pageSize]);

  // Group tasks by status
  const grouped = STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    },
    { BACKLOG: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] },
  );
  const hasActiveFilters =
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    Boolean(search);
  const visibleStatuses = hasActiveFilters
    ? STATUS_ORDER.filter((status) => grouped[status].length > 0)
    : STATUS_ORDER;

  return (
    <div className="flex h-full flex-col bg-[#FAFAFA]">
      <SprintBoardHeader
        onAddTask={() => setIsCreateTaskOpen(true)}
        search={searchInput}
        onSearchChange={setSearchInput}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <div className="flex-1 overflow-y-auto py-4">
        {loading && (
          <div className="py-4">
            <TaskGroupSkeleton rowCount={4} />
            <TaskGroupSkeleton rowCount={2} />
            <TaskGroupSkeleton rowCount={3} />
          </div>
        )}
        {error && (
          <div className="mx-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          visibleStatuses.map((status) => (
            <TaskGroup key={status} status={status} tasks={grouped[status]} />
          ))}

        {!loading &&
          !error &&
          hasActiveFilters &&
          visibleStatuses.length === 0 && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                <SearchX className="h-6 w-6 text-zinc-400" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-zinc-700">
                No tasks found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                No tasks match the current filters. Try adjusting your filters
                or search.
              </p>
            </div>
          )}

        {!loading && !error && (
          <div className="mt-4 flex items-center justify-center gap-2 px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <span className="text-xs text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <TaskFooter />

      <CreateTaskModal
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreated={() => {
          setPage(1);
          setRefreshKey((value) => value + 1);
        }}
      />
    </div>
  );
}
