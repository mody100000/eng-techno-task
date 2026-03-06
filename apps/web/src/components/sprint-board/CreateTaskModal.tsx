"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Dropdown from "@/components/common/Dropdown";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "@/constants/task";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/types/task.types";

const API_BASE_URL = "http://localhost:5000";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
};

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function CreateTaskModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("BACKLOG");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [category, setCategory] = useState<TaskCategory>("FRONTEND");
  const [assignee, setAssignee] = useState("");
  const [startDate, setStartDate] = useState(getTodayDateInputValue());
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dueDateError = useMemo(() => {
    if (!dueDate || !startDate) return "";
    if (new Date(dueDate).getTime() < new Date(startDate).getTime()) {
      return "Due date must be after start date";
    }
    return "";
  }, [dueDate, startDate]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setStatus("BACKLOG");
    setPriority("MEDIUM");
    setCategory("FRONTEND");
    setAssignee("");
    setStartDate(getTodayDateInputValue());
    setDueDate("");
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    resetForm();
    onClose();
  }, [loading, onClose, resetForm]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (dueDateError) {
      setError(dueDateError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          category,
          assignedToId: assignee.trim() || undefined,
          startDate: startDate
            ? new Date(`${startDate}T00:00:00`).toISOString()
            : undefined,
          dueDate: dueDate
            ? new Date(`${dueDate}T00:00:00`).toISOString()
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create task");
      }

      onCreated(data.task as Task);
      resetForm();
      onClose();
      toast.success("Task created successfully!");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create task",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Accessible backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Modal card — sibling to backdrop, no stopPropagation needed */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Create Task</h2>
            <p className="text-sm text-zinc-500">
              Add a new task to the sprint board.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />

          <Input
            as="textarea"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Task details"
          />

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Dropdown
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
            <Dropdown
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={priorityOptions}
            />
            <Dropdown
              label="Category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Input
              label="Assignee"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              placeholder="User id (optional)"
            />
            <Input
              label="Start Date"
              type="date"
              required
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              error={dueDateError}
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
