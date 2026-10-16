"use client";

import React, { useState } from "react";
import { X, Calendar, AlertCircle } from "lucide-react";
import { Task, TaskStatus } from "@/lib/api";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: string | null;
  }) => Promise<void>;
  initialData?: Task | null;
  defaultStatus?: TaskStatus;
}

function TaskModalForm({
  initialData,
  defaultStatus,
  onClose,
  onSave,
}: {
  initialData?: Task | null;
  defaultStatus: TaskStatus;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: string | null;
  }) => Promise<void>;
}) {
  const getInitialDueDate = (): string => {
    if (!initialData?.due_date) return "";
    const d = new Date(initialData.due_date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialData?.status ?? defaultStatus);
  const [dueDate, setDueDate] = useState<string>(getInitialDueDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        status,
        due_date: dueDate ? dueDate : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const setPresetDate = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    setDueDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Title input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="task-title" className="font-semibold text-slate-800 dark:text-slate-200">
            Title <span className="text-rose-500">*</span>
          </label>
          <span className="text-slate-400 dark:text-slate-500">{title.length}/200</span>
        </div>
        <input
          id="task-title"
          type="text"
          required
          maxLength={200}
          placeholder="e.g. Implement user authentication test suite"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all"
          autoFocus
        />
      </div>

      {/* Description input */}
      <div className="space-y-1.5">
        <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
          Description (optional)
        </label>
        <textarea
          id="task-desc"
          rows={3}
          placeholder="Add details, notes, links, or acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all resize-y"
        />
      </div>

      {/* Status and Due Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1.5">
          <label htmlFor="task-status" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all cursor-pointer"
          >
            <option value="todo" className="bg-white dark:bg-[#0d121f] text-slate-900 dark:text-white">To Do</option>
            <option value="in_progress" className="bg-white dark:bg-[#0d121f] text-slate-900 dark:text-white">In Progress</option>
            <option value="done" className="bg-white dark:bg-[#0d121f] text-slate-900 dark:text-white">Completed</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-1.5">
          <label htmlFor="task-due" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
            Due Date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1c273e] bg-slate-50 dark:bg-[#07090e] px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-[#d2f801] focus:bg-white dark:focus:bg-[#07090e] transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Due Date Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Quick dates:
        </span>
        <button
          type="button"
          onClick={() => setPresetDate(0)}
          className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-[#0e1422] hover:bg-slate-200 dark:hover:bg-[#151d30] border border-slate-200 dark:border-[#1c273e] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setPresetDate(1)}
          className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-[#0e1422] hover:bg-slate-200 dark:hover:bg-[#151d30] border border-slate-200 dark:border-[#1c273e] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => setPresetDate(7)}
          className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-[#0e1422] hover:bg-slate-200 dark:hover:bg-[#151d30] border border-slate-200 dark:border-[#1c273e] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          Next Week
        </button>
        {dueDate && (
          <button
            type="button"
            onClick={() => setDueDate("")}
            className="px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors cursor-pointer"
          >
            Clear date
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#1c273e]">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-slate-200 dark:border-[#1c273e] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#151d30] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 text-sm font-extrabold rounded-full bg-[#d2f801] hover:bg-[#bce000] text-black shadow-md shadow-[#d2f801]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Task"
          )}
        </button>
      </div>
    </form>
  );
}

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultStatus = "todo",
}: TaskModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-[#1c273e] bg-white dark:bg-[#0d121f] p-6 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1c273e]">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151d30] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TaskModalForm
          key={initialData?.id ?? "new-task"}
          initialData={initialData}
          defaultStatus={defaultStatus}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
