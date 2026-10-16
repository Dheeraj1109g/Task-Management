"use client";

import React from "react";
import { Plus, Clock, TrendingUp, CheckCircle2, ArrowRight, ArrowLeft, Edit3, Trash2, User } from "lucide-react";
import { Task, TaskStatus, User as UserType } from "@/lib/api";

interface KanbanBoardProps {
  tasks: Task[];
  currentUser?: UserType | null;
  onUpdateStatus: (id: number, status: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
  isBusyId?: number | null;
}

export function KanbanBoard({
  tasks,
  currentUser,
  onUpdateStatus,
  onEdit,
  onDeleteRequest,
  onQuickAdd,
  isBusyId = null,
}: KanbanBoardProps) {
  const columns: {
    id: TaskStatus;
    title: string;
    icon: typeof Clock;
    color: string;
    bgHeader: string;
    badgeColor: string;
  }[] = [
    {
      id: "todo",
      title: "To Do",
      icon: Clock,
      color: "text-sky-600 dark:text-sky-400",
      bgHeader: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50 text-sky-900 dark:text-sky-300",
      badgeColor: "bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200",
    },
    {
      id: "in_progress",
      title: "In Progress",
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bgHeader: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-300",
      badgeColor: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200",
    },
    {
      id: "done",
      title: "Completed",
      icon: CheckCircle2,
      color: "text-slate-950 dark:text-[#d2f801]",
      bgHeader: "bg-[#d2f801]/30 dark:bg-[#d2f801]/15 border-[#bfe700] dark:border-[#d2f801]/30 text-slate-950 dark:text-[#d2f801]",
      badgeColor: "bg-[#d2f801] text-black font-extrabold",
    },
  ];

  const isAdmin = currentUser?.role === "admin";
  const isManager = currentUser?.role === "manager";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-[#080c14] border border-slate-200/90 dark:border-[#1a2338] p-3.5 min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${col.bgHeader} mb-3.5 shadow-xs`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${col.color}`} />
                <h3 className="font-bold text-sm">{col.title}</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Task list in column */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-1">
              {colTasks.map((t) => {
                const isBusy = isBusyId === t.id;
                const isOwner = currentUser?.id === t.owner_id;
                const canEdit = isOwner || isAdmin || isManager;
                const canDelete = isOwner || isAdmin;

                let dueText: string | null = null;
                let isOverdue = false;
                if (t.due_date) {
                  const d = new Date(t.due_date);
                  isOverdue = d.getTime() < Date.now() && t.status !== "done";
                  dueText = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                }

                return (
                  <div
                    key={t.id}
                    className={`group relative rounded-xl border p-3.5 bg-white dark:bg-[#0c101a] border-slate-200/90 dark:border-[#1c273e] hover:border-slate-300 dark:hover:border-[#2a3754] hover:shadow-md transition-all shadow-xs ${
                      isBusy ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug break-words flex-1">
                        {t.title}
                      </h4>
                      {(canEdit || canDelete) && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {canEdit && (
                            <button
                              onClick={() => onEdit(t)}
                              title="Edit"
                              className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-[#151d30] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => onDeleteRequest(t)}
                              title="Delete"
                              className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {t.description && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 break-words">
                        {t.description}
                      </p>
                    )}

                    {/* Owner tag if available */}
                    {t.owner_email && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <User className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span className="truncate max-w-[180px]">{t.owner_email}</span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1c273e] text-xs text-slate-500 dark:text-slate-400">
                      {dueText ? (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                              : "bg-slate-100 dark:bg-[#0e1422] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1c273e]"
                          }`}
                        >
                          {isOverdue ? `Overdue (${dueText})` : `Due ${dueText}`}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">No due date</span>
                      )}

                      {/* Directional Shift Buttons */}
                      {canEdit && (
                        <div className="flex items-center gap-1">
                          {col.id !== "todo" && (
                            <button
                              disabled={isBusy}
                              onClick={() =>
                                onUpdateStatus(t.id, col.id === "done" ? "in_progress" : "todo")
                              }
                              title="Move left"
                              className="p-1 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-[#151d30] cursor-pointer"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {col.id !== "done" && (
                            <button
                              disabled={isBusy}
                              onClick={() =>
                                onUpdateStatus(t.id, col.id === "todo" ? "in_progress" : "done")
                              }
                              title="Move right"
                              className="p-1 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-[#151d30] cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-[#1c273e] rounded-xl bg-white/50 dark:bg-[#0a0e17]/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No tasks in this lane</p>
                </div>
              )}
            </div>

            {/* Quick add button in column */}
            <button
              onClick={() => onQuickAdd(col.id)}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-[#0c101a] bg-white/60 dark:bg-[#0c101a]/60 border border-dashed border-slate-300 dark:border-[#1c273e] hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}
