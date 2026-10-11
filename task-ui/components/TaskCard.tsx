"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { Task, TaskStatus } from "@/lib/api";

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: number, status: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  isBusy?: boolean;
}

export function TaskCard({
  task,
  onUpdateStatus,
  onEdit,
  onDeleteRequest,
  isBusy = false,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState(false);

  const isDone = task.status === "done";
  const isInProgress = task.status === "in_progress";
  const isTodo = task.status === "todo";

  // Due date logic
  let dueDateInfo: { text: string; status: "overdue" | "today" | "upcoming" } | null = null;
  if (task.due_date) {
    const due = new Date(task.due_date);
    const now = new Date();
    // Compare dates only
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

    const formattedDate = due.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: due.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });

    if (diffDays < 0 && !isDone) {
      dueDateInfo = {
        text: `Overdue (${formattedDate})`,
        status: "overdue",
      };
    } else if (diffDays === 0) {
      dueDateInfo = {
        text: "Due Today",
        status: "today",
      };
    } else {
      dueDateInfo = {
        text: `Due ${formattedDate}`,
        status: "upcoming",
      };
    }
  }

  const createdDate = new Date(task.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const handleToggleDone = () => {
    if (isBusy) return;
    const nextStatus: TaskStatus = isDone ? "todo" : "done";
    onUpdateStatus(task.id, nextStatus);
  };

  const getNextStatus = (): TaskStatus => {
    if (isTodo) return "in_progress";
    if (isInProgress) return "done";
    return "todo";
  };

  return (
    <div
      className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
        isDone
          ? "bg-slate-900/30 border-slate-800/50 opacity-75 hover:opacity-100"
          : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox / Complete button */}
        <button
          onClick={handleToggleDone}
          disabled={isBusy}
          title={isDone ? "Mark as To Do" : "Mark as Done"}
          className={`mt-0.5 shrink-0 rounded-full transition-transform active:scale-90 cursor-pointer ${
            isBusy ? "opacity-50" : ""
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
          ) : isInProgress ? (
            <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-dashed flex items-center justify-center hover:bg-amber-400/10">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
          ) : (
            <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-semibold text-base leading-snug break-words ${
                isDone ? "line-through text-slate-500" : "text-slate-100"
              }`}
            >
              {task.title}
            </h3>

            {/* Actions Menu */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-7 z-30 w-36 rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-2xl animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteRequest(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="mt-1.5">
              <p
                className={`text-sm text-slate-400 whitespace-pre-line break-words ${
                  !expandedDesc && task.description.length > 150 ? "line-clamp-2" : ""
                }`}
              >
                {task.description}
              </p>
              {task.description.length > 150 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  {expandedDesc ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
            {/* Status Badge */}
            <div className="relative">
              <select
                value={task.status}
                disabled={isBusy}
                onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                className={`appearance-none pl-2.5 pr-6 py-1 rounded-full font-medium text-xs border cursor-pointer transition-all ${
                  isTodo
                    ? "bg-sky-500/10 text-sky-300 border-sky-500/20 hover:border-sky-500/40"
                    : isInProgress
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:border-amber-500/40"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40"
                }`}
              >
                <option value="todo" className="bg-slate-900 text-slate-200">To Do</option>
                <option value="in_progress" className="bg-slate-900 text-slate-200">In Progress</option>
                <option value="done" className="bg-slate-900 text-slate-200">Completed</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            {/* Due date badge */}
            {dueDateInfo && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                  dueDateInfo.status === "overdue"
                    ? "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                    : dueDateInfo.status === "today"
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    : "bg-slate-800/80 text-slate-300 border border-slate-700/60"
                }`}
              >
                {dueDateInfo.status === "overdue" ? (
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-400" />
                )}
                {dueDateInfo.text}
              </span>
            )}

            {/* Created date */}
            <span className="inline-flex items-center gap-1 text-slate-500 ml-auto">
              <Clock className="w-3 h-3" />
              {createdDate}
            </span>

            {/* Quick forward status */}
            {!isDone && (
              <button
                onClick={() => onUpdateStatus(task.id, getNextStatus())}
                disabled={isBusy}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                title={`Advance to ${getNextStatus() === "in_progress" ? "In Progress" : "Done"}`}
              >
                <span>{getNextStatus() === "in_progress" ? "Start" : "Complete"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
