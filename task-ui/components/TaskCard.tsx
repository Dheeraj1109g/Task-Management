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
  ChevronDown,
  User,
} from "lucide-react";
import { Task, TaskStatus, User as UserType } from "@/lib/api";

interface TaskCardProps {
  task: Task;
  currentUser?: UserType | null;
  onUpdateStatus: (id: number, status: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  isBusy?: boolean;
}

export function TaskCard({
  task,
  currentUser,
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

  const isOwner = currentUser?.id === task.owner_id;
  const isAdmin = currentUser?.role === "admin";
  const isManager = currentUser?.role === "manager";

  const canEdit = isOwner || isAdmin || isManager;
  const canDelete = isOwner || isAdmin;

  // Due date logic
  let dueDateInfo: { text: string; status: "overdue" | "today" | "upcoming" } | null = null;
  if (task.due_date) {
    const due = new Date(task.due_date);
    const now = new Date();
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
    if (isBusy || !canEdit) return;
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
          ? "bg-slate-50/70 dark:bg-[#07090e]/70 border-slate-200/70 dark:border-[#151d30] opacity-80 hover:opacity-100 shadow-xs"
          : "bg-white dark:bg-[#0c101a] border-slate-200/90 dark:border-[#1a2338] hover:border-slate-300 dark:hover:border-[#2a3754] hover:shadow-md shadow-xs"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox / Complete button */}
        <button
          onClick={handleToggleDone}
          disabled={isBusy || !canEdit}
          title={!canEdit ? "Permission required to edit" : isDone ? "Mark as To Do" : "Mark as Done"}
          className={`mt-0.5 shrink-0 rounded-full transition-transform active:scale-90 ${
            !canEdit ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          } ${isBusy ? "opacity-50" : ""}`}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/50" />
          ) : isInProgress ? (
            <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-dashed flex items-center justify-center hover:bg-amber-50 dark:hover:bg-amber-950/40">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          ) : (
            <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-semibold text-base leading-snug break-words ${
                isDone ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
              }`}
            >
              {task.title}
            </h3>

            {/* Actions Menu */}
            {(canEdit || canDelete) && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#151d30] transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-7 z-30 w-36 rounded-xl border border-slate-200 dark:border-[#1c273e] bg-white dark:bg-[#0d121f] p-1 shadow-xl animate-in fade-in zoom-in-95">
                      {canEdit && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onEdit(task);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151d30] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          Edit Task
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onDeleteRequest(task);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="mt-1.5">
              <p
                className={`text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line break-words ${
                  !expandedDesc && task.description.length > 150 ? "line-clamp-2" : ""
                }`}
              >
                {task.description}
              </p>
              {task.description.length > 150 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="mt-1 text-xs text-slate-900 dark:text-[#d2f801] hover:underline font-bold cursor-pointer"
                >
                  {expandedDesc ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#1c273e] text-xs">
            {/* Status Badge */}
            <div className="relative">
              <select
                value={task.status}
                disabled={isBusy || !canEdit}
                onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                className={`appearance-none pl-2.5 pr-6 py-1 rounded-full font-semibold text-xs border transition-all ${
                  !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                } ${
                  isTodo
                    ? "bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60 hover:border-sky-300"
                    : isInProgress
                    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:border-amber-300"
                    : "bg-[#d2f801]/30 dark:bg-[#d2f801]/15 text-slate-950 dark:text-[#d2f801] border-[#bfe700] dark:border-[#d2f801]/30 hover:bg-[#d2f801]/40"
                }`}
              >
                <option value="todo" className="bg-white dark:bg-[#0d121f] text-slate-800 dark:text-slate-200">To Do</option>
                <option value="in_progress" className="bg-white dark:bg-[#0d121f] text-slate-800 dark:text-slate-200">In Progress</option>
                <option value="done" className="bg-white dark:bg-[#0d121f] text-slate-800 dark:text-slate-200">Completed</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-slate-600 dark:text-slate-400" />
            </div>

            {/* Owner Email tag if team view or not current user */}
            {task.owner_email && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-slate-100 dark:bg-[#0e1422] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1c273e] max-w-[160px] truncate"
                title={`Assigned to: ${task.owner_email}`}
              >
                <User className="w-3 h-3 shrink-0 text-slate-500 dark:text-slate-400" />
                <span className="truncate">{task.owner_email.split("@")[0]}</span>
              </span>
            )}

            {/* Due date badge */}
            {dueDateInfo && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${
                  dueDateInfo.status === "overdue"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                    : dueDateInfo.status === "today"
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                    : "bg-slate-100 dark:bg-[#0e1422] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1c273e]"
                }`}
              >
                {dueDateInfo.status === "overdue" ? (
                  <AlertCircle className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                )}
                {dueDateInfo.text}
              </span>
            )}

            {/* Created date */}
            <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 ml-auto">
              <Clock className="w-3 h-3" />
              {createdDate}
            </span>

            {/* Quick forward status */}
            {!isDone && canEdit && (
              <button
                onClick={() => onUpdateStatus(task.id, getNextStatus())}
                disabled={isBusy}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#0e1422] hover:bg-slate-200 dark:hover:bg-[#151d30] transition-colors cursor-pointer"
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
